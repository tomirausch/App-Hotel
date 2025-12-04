package com.example.crud.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadiaDetalleDTO {

    @NotNull(message = "El ID de la habitación es obligatorio")
    private Long idHabitacion;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;
}
