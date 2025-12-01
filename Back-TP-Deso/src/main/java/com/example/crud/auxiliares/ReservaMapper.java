package com.example.crud.auxiliares;

import com.example.crud.dto.ReservaDTO;
import com.example.crud.dto.ReservaDetalleDTO;
import com.example.crud.enums.EstadoReserva;
import com.example.crud.model.Habitacion;
import com.example.crud.model.Huesped;
import com.example.crud.model.Reserva;
import com.example.crud.model.ReservaHabitacion;

import java.math.BigDecimal;
import java.util.List;

public final class ReservaMapper {

    private ReservaMapper() {
    }

    /**
     * Construye una entidad Reserva lista para guardar.
     */
    public static Reserva toEntity(ReservaDTO request,
            Huesped huesped,
            List<Habitacion> habitaciones,
            BigDecimal montoTotal) {
        if (request == null)
            return null;

        Reserva r = new Reserva();

        // Datos calculados/buscados
        r.setHuesped(huesped);

        // Crear ReservaHabitacion para cada detalle
        if (request.getDetalles() != null && habitaciones != null) {
            for (ReservaDetalleDTO detalle : request.getDetalles()) {
                // Buscar la habitación correspondiente en la lista de entidades
                Habitacion habitacion = habitaciones.stream()
                        .filter(h -> h.getId().equals(detalle.getIdHabitacion()))
                        .findFirst()
                        .orElse(null);

                if (habitacion != null) {
                    ReservaHabitacion rh = new ReservaHabitacion();
                    rh.setHabitacion(habitacion);
                    rh.setReserva(r);
                    rh.setFecha(detalle.getFecha());
                    rh.setEstado(EstadoReserva.PENDIENTE); // Estado inicial por día
                    r.addReservaHabitacion(rh);
                }
            }
        }

        r.setMonto(montoTotal);

        return r;
    }
}
