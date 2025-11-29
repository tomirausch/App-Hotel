package com.example.crud.auxiliares;

import com.example.crud.dto.HabitacionDTO;
import com.example.crud.model.Habitacion;

public final class HabitacionMapper {

    private HabitacionMapper() {
    }

    public static HabitacionDTO toDTO(Habitacion h) {
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

        dto.setEstado(h.getEstadoActual());

        return dto;
    }
}
