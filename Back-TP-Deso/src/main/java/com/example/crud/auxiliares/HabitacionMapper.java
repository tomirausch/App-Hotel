package com.example.crud.auxiliares;

import com.example.crud.dto.HabitacionDTO;
import com.example.crud.enums.EstadoHabitacion;
import com.example.crud.model.Habitacion;

public final class HabitacionMapper {

    private HabitacionMapper() {
    }

    public static HabitacionDTO toDTO(Habitacion h) {
        if (h == null)
            return null;

        HabitacionDTO.HabitacionDTOBuilder builder = HabitacionDTO.builder()
                .id(h.getId())
                .numero(h.getNumero())
                .piso(h.getPiso())
                .estado(Boolean.TRUE.equals(h.getFueraDeServicio()) ? EstadoHabitacion.FUERA_DE_SERVICIO
                        : EstadoHabitacion.DISPONIBLE);

        if (h.getTipoHabitacion() != null) {
            builder.tipoHabitacion(h.getTipoHabitacion().getNombre())
                    .costo(h.getTipoHabitacion().getCosto());
        }

        return builder.build();
    }

}
