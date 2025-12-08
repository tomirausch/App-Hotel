package com.example.crud.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservaPendienteDTO {
    private Long id;
    private String apellidoHuesped;
    private String nombreHuesped;
    private Integer numeroHabitacion;
    private String nombreTipoHabitacion;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
}
