package com.example.crud.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservaDTO {

    @NotEmpty(message = "Debe seleccionar al menos una habitación")
    private List<ReservaDetalleDTO> detalles;

    @NotNull
    @Valid
    private HuespedReservaDTO datosHuesped;
}
