package com.example.crud.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetodoPagoDTO {

    private Long id;

    private String tipoMetodo; // "TARJETA", "EFECTIVO", "CHEQUE"

    private Long idPago;

    // Campos para Tarjeta
    private String tipoTarjeta; // Enum TipoTarjeta
    private String marcaTarjeta; // Enum MarcaTarjeta
    private String numeroTarjeta;

    // Campos para Cheque
    private String numeroCheque;
    private String tipoCheque; // Enum TipoCheque
    private String plaza;
    private LocalDate fechaCobro;
    private String banco;

    // Campos para Efectivo
    private String moneda; // Enum TipoMoneda
    private String cotizacion;
}
