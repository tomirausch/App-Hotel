package com.example.crud.auxiliares;

import com.example.crud.dto.HabitacionDTO;
import com.example.crud.enums.EstadoHabitacion;
import com.example.crud.model.Habitacion;

public final class HabitacionEstadoMapper {

    private HabitacionEstadoMapper() {
    }

    public static HabitacionDTO toDTO(Habitacion h,
            EstadoHabitacion estadoEnRango) {
        if (h == null)
            return null;

        HabitacionDTO dto = new HabitacionDTO();
        dto.setId(h.getId());
        dto.setNumero(h.getNumero());
        dto.setPiso(h.getPiso());

        if (h.getTipoHabitacion() != null) {
            dto.setTipoHabitacion(h.getTipoHabitacion().getNombre());
            dto.setCosto(h.getTipoHabitacion().getCosto());
        }

        dto.setEstado(estadoEnRango);

        return dto;
    }
}
