package com.example.crud.dto;

import jakarta.validation.constraints.FutureOrPresent;
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
public class ReservaDetalleDTO {

    @NotNull
    private Long idHabitacion;

    @NotNull
    @FutureOrPresent
    private LocalDate fechaDesde;

    @NotNull
    @FutureOrPresent
    private LocalDate fechaHasta;
}
