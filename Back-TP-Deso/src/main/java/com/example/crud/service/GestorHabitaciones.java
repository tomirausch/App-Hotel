package com.example.crud.service;

import com.example.crud.auxiliares.HuespedMapper;
import com.example.crud.auxiliares.ReservaMapper;
import com.example.crud.dao.*;
import com.example.crud.dto.*;
import com.example.crud.enums.EstadoReserva;
import com.example.crud.enums.EstadoHabitacion;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GestorHabitaciones {

    private final HabitacionDao habitacionDao;
    private final ReservaDao reservaDao;
    private final GestorHuespedes gestorHuespedes;
    private final EstadiaDao estadiaDao;
    private final AcompanianteDao acompanianteDao;
    private final HuespedDao huespedDao;

    public GestorHabitaciones(HabitacionDao habitacionDao,
            ReservaDao reservaDao,
            GestorHuespedes gestorHuespedes,
            EstadiaDao estadiaDao,
            AcompanianteDao acompanianteDao,
            HuespedDao huespedDao) {
        this.habitacionDao = habitacionDao;
        this.reservaDao = reservaDao;
        this.gestorHuespedes = gestorHuespedes;
        this.estadiaDao = estadiaDao;
        this.acompanianteDao = acompanianteDao;
        this.huespedDao = huespedDao;
    }

    public List<Habitacion> listarTodas() {
        return habitacionDao.findAllOrdenadas();
    }

    public Habitacion obtenerPorId(Long id) {
        return habitacionDao.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró habitación id=" + id));
    }

    public List<HabitacionDTO> calcularEstadoDiario(LocalDate desde, LocalDate hasta) {
        List<Habitacion> habitaciones = habitacionDao.findAllOrdenadas();
        List<Reserva> reservas = reservaDao.buscarReservasEntre(desde, hasta);
        List<Estadia> estadias = estadiaDao.buscarEstadiasEntre(desde, hasta);
        List<HabitacionDTO> resultado = new ArrayList<>();

        for (LocalDate fecha = desde; !fecha.isAfter(hasta); fecha = fecha.plusDays(1)) {
            final LocalDate fechaActual = fecha;

            for (Habitacion h : habitaciones) {
                EstadoHabitacion estadoDia = determinarEstadoDia(h, fechaActual, reservas, estadias);
                HabitacionDTO dto = new HabitacionDTO(
                        h.getId(),
                        h.getNumero(),
                        h.getTipoHabitacion() != null ? h.getTipoHabitacion().getNombre() : "Sin Tipo",
                        fechaActual,
                        estadoDia);

                dto.setPiso(h.getPiso());
                dto.setCosto(h.getTipoHabitacion() != null ? h.getTipoHabitacion().getCosto() : null);

                if (estadoDia == EstadoHabitacion.RESERVADA) {
                    reservas.stream()
                            .flatMap(r -> r.getReservaHabitaciones().stream()
                                    .filter(rh -> rh.getHabitacion().equals(h) &&
                                            rh.getFecha().equals(fechaActual) &&
                                            (rh.getEstado() == EstadoReserva.PENDIENTE ||
                                                    rh.getEstado() == EstadoReserva.CONFIRMADA))
                                    .map(rh -> r))
                            .findFirst()
                            .ifPresent(reserva -> {
                                dto.setIdReserva(reserva.getId());
                                dto.setIdHuespedResponsable(reserva.getHuesped().getId());
                            });
                }

                resultado.add(dto);
            }
        }
        return resultado;
    }

    // ===========================================================
    // CU04 – CONFIRMAR RESERVA
    // ===========================================================
    @Transactional
    public Reserva confirmarReserva(ReservaDTO request) {
        List<Habitacion> habitaciones = obtenerHabitaciones(request.getDetalles());
        Huesped huesped = obtenerOcrearHuesped(request);
        BigDecimal montoTotal = calcularMontoTotal(habitaciones, request.getDetalles());
        Reserva nuevaReserva = ReservaMapper.toEntity(request, huesped, habitaciones, montoTotal);
        return reservaDao.save(nuevaReserva);
    }

    // ===========================================================
    // CU15 – OCUPAR HABITACIÓN
    // ===========================================================
    @Transactional
    public Estadia ocuparHabitacion(OcuparHabitacionRequestDTO request) {

        // 1. Obtener huésped responsable
        Huesped responsable = huespedDao.findById(request.getIdHuespedResponsableEstadia())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró huésped con ID: " + request.getIdHuespedResponsableEstadia()));

        // 2. Obtener acompañantes si existen
        List<Acompaniante> acompanantes = new ArrayList<>();
        if (request.getListaAcompanantes() != null && !request.getListaAcompanantes().isEmpty()) {
            acompanantes = acompanianteDao.findAllById(request.getListaAcompanantes());
        }

        // 3. Agrupar detalles por tipo de operación
        Map<String, List<OcuparHabitacionDetalleDTO>> agrupadoPorTipo = agruparDetallesPorTipo(
                request.getDetalles(),
                request.getIdHuespedResponsableEstadia());

        List<OcuparHabitacionDetalleDTO> pisarReserva = agrupadoPorTipo.get("PISAR");
        List<OcuparHabitacionDetalleDTO> efectivizar = agrupadoPorTipo.get("EFECTIVIZAR");

        // 4. Procesar detalles de tipo PISAR - Cancelar reservas de otros
        if (!pisarReserva.isEmpty()) {
            procesarPisarReservas(pisarReserva);
        }

        // 5. Procesar detalles de tipo EFECTIVIZAR - Confirmar reservas propias
        Reserva reservaOrigen = null;
        if (!efectivizar.isEmpty()) {
            reservaOrigen = procesarEfectivizarReservas(efectivizar);
        }

        // 6. Obtener todas las habitaciones únicas involucradas
        Set<Long> idsHabitaciones = request.getDetalles().stream()
                .map(OcuparHabitacionDetalleDTO::getIdHabitacion)
                .collect(Collectors.toSet());

        Map<Long, Habitacion> habitacionMap = new HashMap<>();
        for (Long idHab : idsHabitaciones) {
            habitacionMap.put(idHab, obtenerPorId(idHab));
        }

        // 7. Calcular costo total de la estadía
        BigDecimal costoTotal = calcularCostoEstadia(request.getDetalles(), habitacionMap);

        // 8. Crear la estadía
        Estadia estadia = new Estadia();
        estadia.setResponsable(responsable);
        estadia.setAcompanantes(acompanantes);
        estadia.setCostoEstadia(costoTotal);
        estadia.setReservaOrigen(reservaOrigen);
        estadia.setDescuento(0.0);

        int cantPersonas = 1;
        if (acompanantes != null) {
            cantPersonas += acompanantes.size();
        }
        estadia.setCantPersonas(cantPersonas);

        // 9. Crear EstadiaHabitacion por cada detalle
        for (OcuparHabitacionDetalleDTO detalle : request.getDetalles()) {
            Habitacion hab = habitacionMap.get(detalle.getIdHabitacion());
            EstadiaHabitacion eh = new EstadiaHabitacion(estadia, hab, detalle.getFecha());
            estadia.addEstadiaHabitacion(eh);
        }

        // 10. Guardar y retornar
        return estadiaDao.save(estadia);
    }

    private Map<String, List<OcuparHabitacionDetalleDTO>> agruparDetallesPorTipo(
            List<OcuparHabitacionDetalleDTO> detalles,
            Long idHuespedResponsableEstadia) {

        Map<String, List<OcuparHabitacionDetalleDTO>> agrupado = new HashMap<>();
        agrupado.put("DISPONIBLE", new ArrayList<>());
        agrupado.put("PISAR", new ArrayList<>());
        agrupado.put("EFECTIVIZAR", new ArrayList<>());

        for (OcuparHabitacionDetalleDTO detalle : detalles) {
            if (detalle.getEstado() == EstadoHabitacion.DISPONIBLE) {
                agrupado.get("DISPONIBLE").add(detalle);
            } else if (detalle.getEstado() == EstadoHabitacion.RESERVADA) {
                // Verificar si es pisar o efectivizar
                if (detalle.getIdHuespedResponsableReserva().equals(idHuespedResponsableEstadia)) {
                    agrupado.get("EFECTIVIZAR").add(detalle);
                } else {
                    agrupado.get("PISAR").add(detalle);
                }
            }
        }

        return agrupado;
    }

    private void procesarPisarReservas(List<OcuparHabitacionDetalleDTO> detalles) {
        // Agrupar por idReserva
        Map<Long, List<LocalDate>> reservaFechas = detalles.stream()
                .collect(Collectors.groupingBy(
                        OcuparHabitacionDetalleDTO::getIdReserva,
                        Collectors.mapping(OcuparHabitacionDetalleDTO::getFecha, Collectors.toList())));

        // Por cada reserva, cancelar las ReservaHabitacion correspondientes
        for (Map.Entry<Long, List<LocalDate>> entry : reservaFechas.entrySet()) {
            Long idReserva = entry.getKey();
            List<LocalDate> fechas = entry.getValue();

            List<ReservaHabitacion> reservaHabitaciones = reservaDao
                    .buscarReservaHabitacionesPorReservaYFechas(idReserva, fechas);

            for (ReservaHabitacion rh : reservaHabitaciones) {
                rh.setEstado(EstadoReserva.CANCELADA);
            }
        }
    }

    private Reserva procesarEfectivizarReservas(List<OcuparHabitacionDetalleDTO> detalles) {
        // Todos los detalles de efectivización deben pertenecer a la misma reserva
        Long idReserva = detalles.get(0).getIdReserva();
        List<LocalDate> fechas = detalles.stream()
                .map(OcuparHabitacionDetalleDTO::getFecha)
                .collect(Collectors.toList());

        List<ReservaHabitacion> reservaHabitaciones = reservaDao.buscarReservaHabitacionesPorReservaYFechas(idReserva,
                fechas);

        for (ReservaHabitacion rh : reservaHabitaciones) {
            rh.setEstado(EstadoReserva.CONFIRMADA);
        }

        // Retornar la reserva para vincularla con la estadía
        return reservaDao.findById(idReserva)
                .orElseThrow(() -> new RecursoNoEncontradoException("Reserva no encontrada: " + idReserva));
    }

    private BigDecimal calcularCostoEstadia(List<OcuparHabitacionDetalleDTO> detalles,
            Map<Long, Habitacion> habitacionMap) {
        BigDecimal total = BigDecimal.ZERO;

        for (OcuparHabitacionDetalleDTO detalle : detalles) {
            Habitacion hab = habitacionMap.get(detalle.getIdHabitacion());
            if (hab.getTipoHabitacion() != null) {
                total = total.add(hab.getTipoHabitacion().getCosto());
            }
        }

        return total;
    }

    private List<Habitacion> obtenerHabitaciones(List<ReservaDetalleDTO> detalles) {
        List<Long> ids = detalles.stream()
                .map(ReservaDetalleDTO::getIdHabitacion)
                .distinct()
                .toList();
        return habitacionDao.findAllById(ids);
    }

    private Huesped obtenerOcrearHuesped(ReservaDTO req) {
        HuespedReservaDTO reservaHuesped = req.getDatosHuesped();
        HuespedDTO huespedDTO = HuespedMapper.toHuespedDTO(reservaHuesped);
        Optional<Huesped> encontrado = gestorHuespedes.buscarPorDocumento(
                huespedDTO.getTipoDocumento(),
                huespedDTO.getNumeroDocumento());

        if (encontrado.isPresent()) {
            return encontrado.get();
        }

        return gestorHuespedes.crear(huespedDTO);
    }

    private BigDecimal calcularMontoTotal(List<Habitacion> habitaciones, List<ReservaDetalleDTO> detalles) {
        BigDecimal total = BigDecimal.ZERO;

        if (detalles == null)
            return total;

        for (ReservaDetalleDTO detalle : detalles) {
            Habitacion h = habitaciones.stream()
                    .filter(hab -> hab.getId().equals(detalle.getIdHabitacion()))
                    .findFirst()
                    .orElseThrow(() -> new RecursoNoEncontradoException("Habitación no encontrada en lista procesada"));

            if (h.getTipoHabitacion() != null) {
                total = total.add(h.getTipoHabitacion().getCosto());
            }
        }
        return total;
    }

    private EstadoHabitacion determinarEstadoDia(Habitacion h, LocalDate fechaActual,
            List<Reserva> reservas, List<Estadia> estadias) {
        boolean ocupada = estadias.stream()
                .flatMap(e -> e.getEstadiaHabitaciones().stream())
                .anyMatch(eh -> eh.getHabitacion().equals(h) && eh.getFecha().equals(fechaActual));

        if (ocupada) {
            return EstadoHabitacion.OCUPADA;
        }

        boolean reservada = reservas.stream()
                .flatMap(r -> r.getReservaHabitaciones().stream())
                .anyMatch(rh -> rh.getHabitacion().equals(h) &&
                        rh.getFecha().equals(fechaActual) &&
                        (rh.getEstado() == EstadoReserva.PENDIENTE || rh.getEstado() == EstadoReserva.CONFIRMADA));

        if (reservada) {
            return EstadoHabitacion.RESERVADA;
        }

        if (h.getEstadoActual() == EstadoHabitacion.MANTENIMIENTO
                || h.getEstadoActual() == EstadoHabitacion.FUERA_DE_SERVICIO) {
            return h.getEstadoActual();
        }

        return EstadoHabitacion.DISPONIBLE;
    }
}
