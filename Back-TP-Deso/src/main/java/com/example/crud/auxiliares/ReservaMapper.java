package com.example.crud.auxiliares;

import com.example.crud.dto.ReservaDTO;
import com.example.crud.dto.ReservaDetalleDTO;
import com.example.crud.model.Habitacion;

import com.example.crud.model.Huesped;
import com.example.crud.model.Reserva;
import com.example.crud.enums.EstadoReserva;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import java.time.temporal.ChronoUnit;

public final class ReservaMapper {

    private ReservaMapper() {
    }

    /**
     * Construye una entidad Reserva lista para guardar.
     */
    public static List<Reserva> toEntity(ReservaDTO request,
            Huesped huesped,
            List<Habitacion> habitaciones) {

        if (request == null || request.getDetalles() == null)
            return new ArrayList<>();

        List<Reserva> reservas = new ArrayList<>();

        for (ReservaDetalleDTO detalle : request.getDetalles()) {
            Habitacion habitacion = habitaciones.stream()
                    .filter(h -> h.getId().equals(detalle.getIdHabitacion()))
                    .findFirst()
                    .orElse(null);

            if (habitacion != null) {
                Reserva r = new Reserva();
                r.setHuesped(huesped);
                r.setHabitacion(habitacion);
                r.setEstado(EstadoReserva.PENDIENTE);
                r.setFechaDesde(detalle.getFechaDesde());
                r.setFechaHasta(detalle.getFechaHasta());

                BigDecimal montoReserva = BigDecimal.ZERO;
                if (habitacion.getTipoHabitacion() != null && detalle.getFechaDesde() != null
                        && detalle.getFechaHasta() != null) {
                    long dias = ChronoUnit.DAYS.between(detalle.getFechaDesde(),
                            detalle.getFechaHasta()) + 1;
                    if (dias > 0) {
                        BigDecimal costoDiario = habitacion.getTipoHabitacion().getCosto();
                        montoReserva = costoDiario.multiply(new BigDecimal(dias));
                    }
                }
                r.setMonto(montoReserva);

                reservas.add(r);
            }
        }

        return reservas;
    }
}
