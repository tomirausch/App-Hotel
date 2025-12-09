package com.example.crud.service;

import com.example.crud.auxiliares.HabitacionMapper;
import com.example.crud.auxiliares.HuespedMapper;
import com.example.crud.auxiliares.ReservaMapper;
import com.example.crud.auxiliares.EstadiaMapper;
import com.example.crud.dao.*;
import com.example.crud.dto.*;
import com.example.crud.enums.EstadoHabitacion;
import com.example.crud.enums.EstadoReserva;
import com.example.crud.enums.EstadoEstadia;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.dto.EstadiaDetalleDTO;

import com.example.crud.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.crud.strategy.PrecioStrategy;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class GestorHabitaciones {

    private final HabitacionDao habitacionDao;
    private final ReservaDao reservaDao;

    private final EstadiaDao estadiaDao;
    private final HuespedDao huespedDao;

    private final PrecioStrategy estrategiaPrecio;

    public List<Habitacion> listarTodas() {
        return habitacionDao.listarTodasOrdenadas();
    }

    public Habitacion obtenerPorId(Long id) {
        return habitacionDao.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró habitación id=" + id));
    }

    public List<HabitacionDTO> calcularEstadoDiario(LocalDate desde, LocalDate hasta) {
        List<Habitacion> habitaciones = habitacionDao.listarTodasOrdenadas();
        List<HabitacionDTO> resultado = new ArrayList<>();

        List<Reserva> todasReservas = reservaDao.buscarEnRangoFecha(desde, hasta);
        List<Estadia> todasEstadias = estadiaDao.buscarEnRangoFecha(desde, hasta);

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

    @Transactional
    public List<Reserva> confirmarReserva(ReservaDTO request, Huesped huesped) {
        List<Habitacion> habitaciones = obtenerHabitaciones(request.getDetalles());
        List<Reserva> nuevasReservas = ReservaMapper.toEntity(request, huesped, habitaciones);
        return reservaDao.saveAll(nuevasReservas);
    }

    @Transactional
    public Estadia ocuparHabitacion(EstadiaDTO request) {

        Huesped responsable = huespedDao.findById(request.getIdHuespedResponsable())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró huésped con ID: " + request.getIdHuespedResponsable()));

        List<Huesped> acompanantes = new ArrayList<>();
        if (request.getListaAcompanantes() != null && !request.getListaAcompanantes().isEmpty()) {
            acompanantes = huespedDao.findAllById(request.getListaAcompanantes());
        }

        Habitacion habitacion = habitacionDao.findById(request.getIdHabitacion())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró habitación id=" + request.getIdHabitacion()));

        LocalDate fechaDesde = request.getFechaDesde();
        LocalDate fechaHasta = request.getFechaHasta();

        List<Reserva> reservasConflictivas = reservaDao.buscarReservasConflictivas(habitacion.getId(), fechaDesde,
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
        Estadia nuevaEstadia = EstadiaMapper.toEntity(responsable, acompanantes, habitacion,
                fechaDesde, fechaHasta, reservaOrigen, EstadoEstadia.ACTIVA);

        BigDecimal costo = estrategiaPrecio.calcularPrecio(habitacion, fechaDesde, fechaHasta);
        nuevaEstadia.setCostoEstadia(costo);

        return estadiaDao.save(nuevaEstadia);
    }

    private List<Habitacion> obtenerHabitaciones(List<ReservaDetalleDTO> detalles) {
        List<Long> ids = detalles.stream().map(ReservaDetalleDTO::getIdHabitacion).distinct().toList();
        return habitacionDao.findAllById(ids);
    }

    private EstadoHabitacion calcularEstadoParaDia(Habitacion habitacion,
            LocalDate fecha,
            List<Reserva> reservas,
            List<Estadia> estadias) {

        if (Boolean.TRUE.equals(habitacion.getFueraDeServicio())) {
            return EstadoHabitacion.FUERA_DE_SERVICIO;
        }

        if (hayEstadiaEnFecha(estadias, fecha)) {
            return EstadoHabitacion.OCUPADA;
        }

        if (hayReservaEnFecha(reservas, fecha)) {
            return EstadoHabitacion.RESERVADA;
        }

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

    @Transactional
    public EstadiaDetalleDTO obtenerDetallesEstadia(Integer numeroHabitacion) {
        Estadia estadia = estadiaDao.buscarActivaPorNumeroHabitacion(numeroHabitacion)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No hay estadía activa para la habitación " + numeroHabitacion));

        List<HuespedDTO> ocupantes = new ArrayList<>();

        Huesped responsable = estadia.getResponsable();
        ocupantes.add(HuespedMapper.toHuespedDTO(responsable));

        if (estadia.getAcompanantes() != null) {
            ocupantes.addAll(estadia.getAcompanantes().stream()
                    .map(HuespedMapper::toHuespedDTO)
                    .collect(Collectors.toList()));
        }

        List<ServicioDTO> servicios = estadia.getEstadiaServicios().stream()
                .map(es -> ServicioDTO.builder()
                        .id(es.getServicio().getId())
                        .nombre(es.getServicio().getNombre())
                        .precioUnidad(es.getServicio().getPrecioUnidad())
                        .detalle(es.getServicio().getDetalle())
                        .build())
                .collect(Collectors.toList());

        return EstadiaDetalleDTO.builder()
                .idEstadia(estadia.getId())
                .costoBaseEstadia(estadia.getCostoEstadia())
                .ocupantes(ocupantes)
                .serviciosConsumidos(servicios)
                .build();
    }

    public List<ReservaPendienteDTO> buscarReservasPendientes(String nombre, String apellido) {
        List<Reserva> reservas = reservaDao.buscarPendientesPorNombreHuesped(nombre, apellido);
        return reservas.stream()
                .map(r -> ReservaPendienteDTO.builder()
                        .id(r.getId())
                        .apellidoHuesped(r.getHuesped().getApellido())
                        .nombreHuesped(r.getHuesped().getNombre())
                        .numeroHabitacion(r.getHabitacion().getNumero())
                        .nombreTipoHabitacion(r.getHabitacion().getTipoHabitacion().getNombre())
                        .fechaDesde(r.getFechaDesde())
                        .fechaHasta(r.getFechaHasta())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelarReservas(List<Long> ids) {
        List<Reserva> reservas = reservaDao.findAllById(ids);
        reservas.forEach(r -> r.setEstado(EstadoReserva.CANCELADA));
        reservaDao.saveAll(reservas);
    }
}
