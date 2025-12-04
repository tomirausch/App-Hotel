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
public class EstadiaDTO {

    private Long id;

    @NotNull(message = "El ID del huésped responsable es obligatorio")
    private Long idHuespedResponsable;

    @Valid
    @NotEmpty(message = "Debe incluir al menos un detalle de habitación y fecha")
    private List<EstadiaDetalleDTO> detalles;

    @Valid
    private List<AcompanianteDTO> acompanantes;
}
