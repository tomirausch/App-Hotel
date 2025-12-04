package com.example.crud.dto;

import com.example.crud.enums.EstadoHabitacion;
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
public class OcuparHabitacionDetalleDTO {

    @NotNull(message = "El ID de la habitación es obligatorio")
    private Long idHabitacion;

    @NotNull(message = "El estado es obligatorio")
    private EstadoHabitacion estado;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    // Null si estado es DISPONIBLE
    private Long idReserva;

    // Null si estado es DISPONIBLE
    private Long idHuespedResponsableReserva;
}
