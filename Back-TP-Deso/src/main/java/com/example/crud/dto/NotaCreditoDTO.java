package com.example.crud.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotaCreditoDTO {

    private Long id;

    @NotNull(message = "La fecha de emisión es obligatoria")
    private LocalDate fechaEmision;

    @NotNull(message = "La hora de emisión es obligatoria")
    private LocalTime horaEmision;

    @NotNull(message = "El ID de la factura es obligatorio")
    private Long idFactura;
}
