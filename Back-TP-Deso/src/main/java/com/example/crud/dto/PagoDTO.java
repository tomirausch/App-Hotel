package com.example.crud.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagoDTO {

    private Long id;

    @NotNull(message = "El importe es obligatorio")
    private Float importe;

    @NotNull(message = "El ID de la factura es obligatorio")
    private Long idFactura;

    @Builder.Default
    private List<MetodoPagoDTO> metodos = new ArrayList<>();
}
