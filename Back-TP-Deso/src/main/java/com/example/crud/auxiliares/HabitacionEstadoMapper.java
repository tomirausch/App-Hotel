package com.example.crud.auxiliares;

import com.example.crud.dto.HabitacionEstadoRangoResponse;
import com.example.crud.model.EstadoHabitacion;
import com.example.crud.model.Habitacion;

public final class HabitacionEstadoMapper {

    private HabitacionEstadoMapper() {}

    public static HabitacionEstadoRangoResponse toResponse(Habitacion h,
                                                           EstadoHabitacion estadoEnRango) {
        if (h == null) return null;

        HabitacionEstadoRangoResponse dto = new HabitacionEstadoRangoResponse();
        dto.setId(h.getId());
        dto.setNumero(h.getNumero());
        dto.setPiso(h.getPiso());

        if (h.getTipoHabitacion() != null) {
            dto.setTipoHabitacion(h.getTipoHabitacion().getNombre());
            dto.setCosto(h.getTipoHabitacion().getCosto());
        }

        dto.setEstadoEnRango(estadoEnRango);

        return dto;
    }
}
