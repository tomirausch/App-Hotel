package com.example.crud.auxiliares;

import com.example.crud.model.*;
import java.math.BigDecimal;
import java.util.List;

public final class EstadiaMapper {

    private EstadiaMapper() {
    }

    public static Estadia toEntity(Huesped responsable,
            List<Acompaniante> acompanantes,
            Habitacion habitacion,
            java.time.LocalDate fechaDesde,
            java.time.LocalDate fechaHasta,
            Reserva reservaOrigen) {
        Estadia nuevaEstadia = new Estadia();
        nuevaEstadia.setResponsable(responsable);
        nuevaEstadia.setAcompanantes(acompanantes);
        nuevaEstadia.setHabitacion(habitacion);
        nuevaEstadia.setFechaDesde(fechaDesde);
        nuevaEstadia.setFechaHasta(fechaHasta);
        nuevaEstadia.setDescuento(0.0);
        nuevaEstadia.setReservaOrigen(reservaOrigen);

        int cantidad = 1;
        if (acompanantes != null) {
            cantidad += acompanantes.size();
        }
        nuevaEstadia.setCantPersonas(cantidad);

        // Calcular costo
        if (habitacion.getTipoHabitacion() != null) {
            long dias = java.time.temporal.ChronoUnit.DAYS.between(fechaDesde, fechaHasta) + 1;
            if (dias < 1)
                dias = 1;
            BigDecimal costoTotal = habitacion.getTipoHabitacion().getCosto().multiply(new BigDecimal(dias));
            nuevaEstadia.setCostoEstadia(costoTotal);
        } else {
            nuevaEstadia.setCostoEstadia(BigDecimal.ZERO);
        }

        return nuevaEstadia;
    }
}
