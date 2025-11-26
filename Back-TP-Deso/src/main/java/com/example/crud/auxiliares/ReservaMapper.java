package com.example.crud.auxiliares;

import com.example.crud.dto.CrearReservaRequest;
import com.example.crud.model.EstadoReserva;
import com.example.crud.model.Habitacion;
import com.example.crud.model.Huesped;
import com.example.crud.model.Reserva;

import java.math.BigDecimal;
import java.util.List;

public final class ReservaMapper {

    private ReservaMapper() {}

    /**
     * Construye una entidad Reserva lista para guardar.
     */
    public static Reserva toEntity(CrearReservaRequest request,
                                   Huesped huesped,
                                   List<Habitacion> habitaciones,
                                   BigDecimal montoTotal) {
        if (request == null) return null;

        Reserva r = new Reserva();

        // Datos del Request
        r.setFechaDesde(request.getFechaDesde());
        r.setFechaHasta(request.getFechaHasta());

        // Datos calculados/buscados
        r.setHuesped(huesped);
        r.setHabitaciones(habitaciones);
        r.setMonto(montoTotal);

        // Estado inicial por defecto
        r.setEstado(EstadoReserva.CONFIRMADA);

        return r;
    }
}