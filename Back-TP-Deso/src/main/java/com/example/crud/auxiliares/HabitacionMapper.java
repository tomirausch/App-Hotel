package com.example.crud.auxiliares;

import com.example.crud.dto.HabitacionResponse;
import com.example.crud.model.Habitacion;

public final class HabitacionMapper {

    private HabitacionMapper() {}

    public static HabitacionResponse toResponse(Habitacion h) {
        if (h == null) return null;

        HabitacionResponse dto = new HabitacionResponse();
        dto.setId(h.getId());
        dto.setNumero(h.getNumero());
        dto.setPiso(h.getPiso());

        if (h.getTipoHabitacion() != null) {
            dto.setTipoHabitacion(h.getTipoHabitacion().getNombre());
            dto.setCosto(h.getTipoHabitacion().getCosto());
        }

        dto.setEstadoActual(h.getEstadoActual());

        return dto;
    }
}
