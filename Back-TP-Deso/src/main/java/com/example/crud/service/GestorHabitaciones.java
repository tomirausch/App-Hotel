package com.example.crud.service;

import com.example.crud.auxiliares.ReservaMapper;
import com.example.crud.auxiliares.ValidadorReserva;
import com.example.crud.dao.*;
import com.example.crud.dto.CrearReservaRequest;
import com.example.crud.dto.OcuparHabitacionRequest;
import com.example.crud.exception.HabitacionNoDisponibleException;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class GestorHabitaciones {

    private final HabitacionDao habitacionDao;
    private final ReservaDao reservaDao;
    private final GestorHuespedes gestorHuespedes;
    private final ValidadorReserva validador;
    private final EstadiaDao estadiaDao;
    private final AcompanianteDao acompanianteDao;

    // Constructor actualizado con TODAS las dependencias
    public GestorHabitaciones(HabitacionDao habitacionDao,
                              ReservaDao reservaDao,
                              GestorHuespedes gestorHuespedes,
                              ValidadorReserva validador,
                              EstadiaDao estadiaDao,
                              AcompanianteDao acompanianteDao) {
        this.habitacionDao = habitacionDao;
        this.reservaDao = reservaDao;
        this.gestorHuespedes = gestorHuespedes;
        this.validador = validador;
        this.estadiaDao = estadiaDao;
        this.acompanianteDao = acompanianteDao;
    }

    public List<Habitacion> listarTodas() {
        return habitacionDao.findAllOrdenadas();
    }
    public Habitacion obtenerPorId(Long id) {
        return habitacionDao.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("No se encontró habitación id=" + id));
    }
    public Map<Long, EstadoHabitacion> calcularEstadoEnRango(LocalDate desde, LocalDate hasta) {
        List<Reserva> reservas = reservaDao.buscarReservasEntre(desde, hasta);
        Map<Long, EstadoHabitacion> estados = new HashMap<>();
        for (Reserva r : reservas) {
            for (Habitacion h : r.getHabitaciones()) {
                estados.put(h.getId(), EstadoHabitacion.RESERVADA);
            }
        }
        return estados;
    }

    // ===========================================================
    // CU04 – CONFIRMAR RESERVA
    // ===========================================================
    @Transactional
    public Reserva confirmarReserva(CrearReservaRequest request) {
        // 1. Validar reglas de negocio básicas
        validador.validarSolicitud(request);

        // 2. Obtener habitaciones y verificar disponibilidad
        List<Habitacion> habitaciones = verificarDisponibilidad(
                request.getIdsHabitaciones(),
                request.getFechaDesde(),
                request.getFechaHasta()
        );

        // 3. Obtener o crear Huésped (Delegamos al experto: GestorHuespedes)
        Huesped huesped = obtenerOcrearHuesped(request);

        // 4. Calcular Monto
        BigDecimal montoTotal = calcularMontoTotal(habitaciones, request.getFechaDesde(), request.getFechaHasta());

        // 5. Ensamblar y Guardar (Usando Mapper)
        Reserva nuevaReserva = ReservaMapper.toEntity(request, huesped, habitaciones, montoTotal);

        return reservaDao.save(nuevaReserva);
    }


    // ===========================================================
    // CU15 – OCUPAR HABITACIÓN
    // ===========================================================
    @Transactional
    public Estadia confirmarOcupacion(OcuparHabitacionRequest request) {
        // 1. Recuperar Entidades
        Habitacion habitacion = obtenerPorId(request.getIdHabitacion());
        Huesped responsable = gestorHuespedes.obtenerPorId(request.getIdHuespedResponsable());

        // Validación de Estado (Casos Alternativos 3.B y 3.C)
        if (habitacion.getEstadoActual() == EstadoHabitacion.MANTENIMIENTO ||
                habitacion.getEstadoActual() == EstadoHabitacion.FUERA_DE_SERVICIO ||
                habitacion.getEstadoActual() == EstadoHabitacion.OCUPADA) {
            throw new HabitacionNoDisponibleException(
                    "La habitación " + habitacion.getNumero() + " no está lista para ocuparse. Estado actual: " + habitacion.getEstadoActual()
            );
        }

        // 2. Procesar Acompañantes (Datos crudos -> Entidades -> Guardar)
        List<Acompaniante> listaAcompanantes = new ArrayList<>();
        if (request.getAcompanantes() != null) {
            for (com.example.crud.dto.DatosAcompaniante dto : request.getAcompanantes()) {
                Acompaniante a = com.example.crud.auxiliares.AcompanianteMapper.toEntity(dto);
                listaAcompanantes.add(acompanianteDao.save(a));
            }
        }

        // 3. Crear Estadía (Usando Mapper)
        Estadia estadia = com.example.crud.auxiliares.EstadiaMapper.toEntity(
                request,
                habitacion,
                responsable,
                listaAcompanantes
        );

        // Guardamos primero para generar ID
        estadiaDao.save(estadia);

        // 4. Modificar Estado Habitación
        habitacion.setEstadoActual(EstadoHabitacion.OCUPADA);
        habitacionDao.save(habitacion);

        // 5. Buscar y Procesar Reservas (Trazabilidad + Estado COMPLETADA)
        List<Reserva> reservasConflictivas = reservaDao.buscarConfirmadasPorHabitacionYFecha(
                habitacion.getId(),
                request.getFechaInicio()
        );

        for (Reserva r : reservasConflictivas) {

            // Verificamos si el huésped que ocupa es el mismo que reservó
            if (r.getHuesped().getId().equals(responsable.getId())) {
                // CASO: ES EL MISMO (Efectivización de Reserva)
                r.setEstado(EstadoReserva.COMPLETADA);
                reservaDao.save(r);

                // Vinculamos la estadía con su reserva de origen
                estadia.setReservaOrigen(r);
                estadiaDao.save(estadia);

            } else {
                // CASO: ES OTRO (Walk-in que "pisa" una reserva ajena)
                // La reserva original se pierde (cancela) y la estadía actual queda como Walk-in (sin origen)
                r.setEstado(EstadoReserva.CANCELADA);
                reservaDao.save(r);
            }
        }

        return estadia;
    }

    private List<Habitacion> verificarDisponibilidad(List<Long> ids, LocalDate desde, LocalDate hasta) {
        List<Habitacion> seleccionadas = new ArrayList<>();
        for (Long idHab : ids) {
            Habitacion h = obtenerPorId(idHab);
            List<Reserva> conflictos = reservaDao.buscarPorHabitacionEntre(idHab, desde, hasta);

            if (!conflictos.isEmpty()) {
                throw new HabitacionNoDisponibleException("La habitación " + h.getNumero() + " no está disponible.");
            }
            seleccionadas.add(h);
        }
        return seleccionadas;
    }

    private Huesped obtenerOcrearHuesped(CrearReservaRequest req) {
        TipoDocumento tipo = req.getDatosHuesped().getTipoDocumento();
        String num = req.getDatosHuesped().getNumeroDocumento();
        return gestorHuespedes.buscarPorDocumento(tipo, num)
                .orElseGet(() -> {
                    Huesped nuevo = new Huesped();
                    nuevo.setNombre(req.getDatosHuesped().getNombre());
                    nuevo.setApellido(req.getDatosHuesped().getApellido());
                    nuevo.setTelefono(req.getDatosHuesped().getTelefono());
                    nuevo.setTipoDocumento(tipo);
                    nuevo.setNumeroDocumento(num);
                    return gestorHuespedes.crear(nuevo);
                });
    }

    private BigDecimal calcularMontoTotal(List<Habitacion> habitaciones, LocalDate desde, LocalDate hasta) {
        long dias = ChronoUnit.DAYS.between(desde, hasta);
        if (dias == 0) dias = 1;

        BigDecimal costoPorNoche = BigDecimal.ZERO;
        for (Habitacion h : habitaciones) {
            if (h.getTipoHabitacion() != null) {
                costoPorNoche = costoPorNoche.add(h.getTipoHabitacion().getCosto());
            }
        }
        return costoPorNoche.multiply(BigDecimal.valueOf(dias));
    }
}