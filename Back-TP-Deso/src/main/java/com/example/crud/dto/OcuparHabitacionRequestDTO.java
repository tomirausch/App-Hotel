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
public class OcuparHabitacionRequestDTO {

    @Valid
    @NotEmpty(message = "Debe incluir al menos un detalle de habitación")
    private List<OcuparHabitacionDetalleDTO> detalles;

    @NotNull(message = "El ID del huésped responsable es obligatorio")
    private Long idHuespedResponsableEstadia;

    // IDs de acompañantes existentes (opcional)
    private List<Long> listaAcompanantes;
}
