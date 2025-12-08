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

    private LocalDate fechaEmision;

    private LocalTime horaEmision;

    @Size(max = 10)
    private String iva;

    private Double montoTotal;

    private com.example.crud.enums.TipoMoneda tipoMoneda;

    private TipoFactura tipo;

    private com.example.crud.enums.EstadoFactura estado;

    private Long idEstadia;

    private Long idHuesped;

    private Long idPersonaJuridica;

    @Builder.Default
    private List<PagoDTO> pagos = new ArrayList<>();

    @Builder.Default
    private List<NotaCreditoDTO> notasCredito = new ArrayList<>();

    @Builder.Default
    private List<LineaFacturaDTO> lineas = new ArrayList<>();

    public List<LineaFacturaDTO> getLineas() {
        return lineas;
    }
}
