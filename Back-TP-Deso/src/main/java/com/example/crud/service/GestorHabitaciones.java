package com.example.crud.service;

import com.example.crud.auxiliares.HabitacionMapper;
import com.example.crud.auxiliares.HuespedMapper;
import com.example.crud.auxiliares.ReservaMapper;
import com.example.crud.auxiliares.EstadiaMapper;
import com.example.crud.dao.*;
import com.example.crud.dto.*;
import com.example.crud.enums.EstadoHabitacion;
import com.example.crud.enums.EstadoReserva;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class GestorHabitaciones {

    private final HabitacionDao habitacionDao;
    private final ReservaDao reservaDao;
    private final GestorHuespedes gestorHuespedes;
    private final EstadiaDao estadiaDao;
    private final AcompanianteDao acompanianteDao;
    private final HuespedDao huespedDao;

    public List<Habitacion> listarTodas() {
        return habitacionDao.findAllOrdenadas();
    }

    public Habitacion obtenerPorId(Long id) {
        return habitacionDao.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró habitación id=" + id));
    }

    public List<HabitacionDTO> calcularEstadoDiario(LocalDate desde, LocalDate hasta) {
        List<Habitacion> habitaciones = habitacionDao.findAllOrdenadas();
        List<HabitacionDTO> resultado = new ArrayList<>();

        List<Reserva> todasReservas = reservaDao.findAllInDateRange(desde, hasta);
        List<Estadia> todasEstadias = estadiaDao.findAllInDateRange(desde, hasta);

        Map<Long, List<Reserva>> reservasPorHabitacion = todasReservas.stream()
                .collect(Collectors.groupingBy(r -> r.getHabitacion().getId()));

        Map<Long, List<Estadia>> estadiasPorHabitacion = todasEstadias.stream()
                .collect(Collectors.groupingBy(e -> e.getHabitacion().getId()));

        for (Habitacion h : habitaciones) {
            List<Reserva> reservas = reservasPorHabitacion.getOrDefault(h.getId(), Collections.emptyList());
            List<Estadia> estadias = estadiasPorHabitacion.getOrDefault(h.getId(), Collections.emptyList());

            for (LocalDate fecha = desde; !fecha.isAfter(hasta); fecha = fecha.plusDays(1)) {
                HabitacionDTO dto = HabitacionMapper.toDTO(h);
                dto.setFecha(fecha);

                EstadoHabitacion estado = calcularEstadoParaDia(h, fecha, reservas, estadias);
                dto.setEstado(estado);

                resultado.add(dto);
            }
        }
        return resultado;
    }

    // ===========================================================
    // CU04 – CONFIRMAR RESERVA
    // ===========================================================
    @Transactional
    public List<Reserva> confirmarReserva(ReservaDTO request) {
        List<Habitacion> habitaciones = obtenerHabitaciones(request.getDetalles());
        Huesped huesped = obtenerOcrearHuesped(request);
        List<Reserva> nuevasReservas = ReservaMapper.toEntity(request, huesped, habitaciones);
        return reservaDao.saveAll(nuevasReservas);
    }

    // ===========================================================
    // CU15 – OCUPAR HABITACIÓN
    // ===========================================================
    @Transactional
    public Estadia ocuparHabitacion(EstadiaDTO request) {

        // 1. Obtener huésped responsable
        Huesped responsable = huespedDao.findById(request.getIdHuespedResponsable())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró huésped con ID: " + request.getIdHuespedResponsable()));

        // 2. Obtener acompañantes
        List<Acompaniante> acompanantes = new ArrayList<>();
        if (request.getIdsAcompanantes() != null && !request.getIdsAcompanantes().isEmpty()) {
            acompanantes = acompanianteDao.findAllById(request.getIdsAcompanantes());
        }

        // 3. Procesar detalle (única habitación)
        Habitacion habitacion = habitacionDao.findById(request.getIdHabitacion())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró habitación id=" + request.getIdHabitacion()));

        LocalDate fechaDesde = request.getFechaDesde();
        LocalDate fechaHasta = request.getFechaHasta();

        // 5. Verificar Reservas
        List<Reserva> reservasConflictivas = reservaDao.findConflictingReservations(habitacion.getId(), fechaDesde,
                fechaHasta);
        Reserva reservaOrigen = null;

        if (!reservasConflictivas.isEmpty()) {
            Reserva reservaEncontrada = reservasConflictivas.get(0);

            if (reservaEncontrada.getHuesped().getId().equals(responsable.getId())) {
                reservaEncontrada.setEstado(EstadoReserva.CONFIRMADA);
                reservaDao.save(reservaEncontrada);
                reservaOrigen = reservaEncontrada;
            } else {
                reservaEncontrada.setEstado(EstadoReserva.CANCELADA);
                reservaDao.save(reservaEncontrada);
            }
        }
        // 6. Crear Estadia
        Estadia nuevaEstadia = EstadiaMapper.toEntity(responsable, acompanantes, habitacion,
                fechaDesde, fechaHasta, reservaOrigen);

        return estadiaDao.save(nuevaEstadia);
    }

    private List<Habitacion> obtenerHabitaciones(List<ReservaDetalleDTO> detalles) {
        List<Long> ids = detalles.stream().map(ReservaDetalleDTO::getIdHabitacion).distinct().toList();
        return habitacionDao.findAllById(ids);
    }

    private Huesped obtenerOcrearHuesped(ReservaDTO req) {
        HuespedReservaDTO reservaHuesped = req.getDatosHuesped();
        HuespedDTO huespedDTO = HuespedMapper.toHuespedDTO(reservaHuesped);
        Optional<Huesped> encontrado = gestorHuespedes.buscarPorDocumento(huespedDTO.getTipoDocumento(),
                huespedDTO.getNumeroDocumento());

        if (encontrado.isPresent()) {
            return encontrado.get();
        }

        return gestorHuespedes.crear(huespedDTO);
    }

    private EstadoHabitacion calcularEstadoParaDia(Habitacion habitacion,
            LocalDate fecha,
            List<Reserva> reservas,
            List<Estadia> estadias) {

        // Si la habitación está fuera de servicio, no se pisa nunca
        if (Boolean.TRUE.equals(habitacion.getFueraDeServicio())) {
            return EstadoHabitacion.FUERA_DE_SERVICIO;
        }

        // 1) Prioridad: Estadia
        if (hayEstadiaEnFecha(estadias, fecha)) {
            return EstadoHabitacion.OCUPADA;
        }

        // 2) Reservas que aplican a ese día
        if (hayReservaEnFecha(reservas, fecha)) {
            return EstadoHabitacion.RESERVADA;
        }

        // CANCELADA o sin reservas → DISPONIBLE
        return EstadoHabitacion.DISPONIBLE;
    }

    private boolean hayEstadiaEnFecha(List<Estadia> estadias, LocalDate fecha) {
        return estadias.stream()
                .anyMatch(e -> !e.getFechaDesde().isAfter(fecha)
                        && !e.getFechaHasta().isBefore(fecha));
    }

    private boolean hayReservaEnFecha(List<Reserva> reservas, LocalDate fecha) {
        return reservas.stream()
                .anyMatch(r -> !r.getFechaDesde().isAfter(fecha)
                        && !r.getFechaHasta().isBefore(fecha));
    }
}
