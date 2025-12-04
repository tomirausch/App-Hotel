package com.example.crud.dto;

import com.example.crud.enums.TipoFactura;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacturaDTO {

    private Long id;

    @NotNull(message = "La fecha de emisión es obligatoria")
    private LocalDate fechaEmision;

    @NotNull(message = "La hora de emisión es obligatoria")
    private LocalTime horaEmision;

    @NotBlank(message = "El número es obligatorio")
    @Size(max = 50)
    private String numero;

    @Size(max = 10)
    private String iva;

    @NotNull(message = "El tipo de factura es obligatorio")
    private TipoFactura tipo;

    private Long idEstadia;

    private Long idHuesped;

    private Long idPersonaJuridica;

    @Builder.Default
    private List<PagoDTO> pagos = new ArrayList<>();

    @Builder.Default
    private List<NotaCreditoDTO> notasCredito = new ArrayList<>();
}
