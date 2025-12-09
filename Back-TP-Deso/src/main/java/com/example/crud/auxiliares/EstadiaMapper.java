package com.example.crud.auxiliares;

import com.example.crud.model.*;
import com.example.crud.enums.EstadoEstadia;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;

public final class EstadiaMapper {

    private EstadiaMapper() {
    }

    public static Estadia toEntity(Huesped responsable,
            List<Huesped> acompanantes,
            Habitacion habitacion,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            Reserva reservaOrigen,
            EstadoEstadia estado) {
        Estadia nuevaEstadia = new Estadia();
        nuevaEstadia.setResponsable(responsable);
        nuevaEstadia.setAcompanantes(acompanantes);
        nuevaEstadia.setHabitacion(habitacion);
        nuevaEstadia.setFechaDesde(fechaDesde);
        nuevaEstadia.setFechaHasta(fechaHasta);
        nuevaEstadia.setDescuento(0.0);
        nuevaEstadia.setReservaOrigen(reservaOrigen);
        nuevaEstadia.setEstado(estado);

        int cantidad = 1;
        if (acompanantes != null) {
            cantidad += acompanantes.size();
        }
        nuevaEstadia.setCantPersonas(cantidad);

        nuevaEstadia.setCostoEstadia(BigDecimal.ZERO);

        return nuevaEstadia;
    }
}
