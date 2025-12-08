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

    @Size(max = 30)
    private String telefono;

    @Size(max = 100)
    private String calle;

    private Integer numero;

    @Size(max = 10)
    private String departamento;

    private Integer piso;
}
