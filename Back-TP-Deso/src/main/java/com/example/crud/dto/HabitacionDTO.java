package com.example.crud.dto;

import com.example.crud.enums.EstadoHabitacion;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitacionDTO {

    private Long id;
    private Integer numero;
    private Integer piso;
    private String tipoHabitacion;
    private BigDecimal costo;
    private EstadoHabitacion estado;
    private LocalDate fecha;

    // Constructor para estado diario (con fecha)
    public HabitacionDTO(Long id, Integer numero, Integer piso, String tipoHabitacion, BigDecimal costo,
            LocalDate fecha, EstadoHabitacion estado) {
        this.id = id;
        this.numero = numero;
        this.piso = piso;
        this.tipoHabitacion = tipoHabitacion;
        this.costo = costo;
        this.fecha = fecha;
        this.estado = estado;
    }
}
