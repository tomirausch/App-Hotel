package com.example.crud.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonaJuridicaDTO {

    private Long id;

    @NotBlank(message = "La razón social es obligatoria")
    @Size(max = 200)
    private String razonSocial;

    @NotBlank(message = "El CUIT es obligatorio")
    @Size(max = 20)
    private String cuit;
}
