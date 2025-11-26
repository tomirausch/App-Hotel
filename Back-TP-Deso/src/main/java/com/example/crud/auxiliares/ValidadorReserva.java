package com.example.crud.auxiliares;

import com.example.crud.dto.CrearReservaRequest;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class ValidadorReserva {

    public void validarSolicitud(CrearReservaRequest request) {
        if (request.getFechaDesde() == null || request.getFechaHasta() == null) {
            throw new IllegalArgumentException("Las fechas de la reserva son obligatorias.");
        }
        if (request.getFechaDesde().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser en el pasado.");
        }
        if (request.getFechaHasta().isBefore(request.getFechaDesde())) {
            throw new IllegalArgumentException("La fecha de salida debe ser posterior a la de entrada.");
        }
        if (request.getIdsHabitaciones() == null || request.getIdsHabitaciones().isEmpty()) {
            throw new IllegalArgumentException("Debe seleccionar al menos una habitación.");
        }
    }
}