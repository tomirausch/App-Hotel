package com.example.crud.dto;

import jakarta.validation.constraints.*;

public class PersonaJuridicaDTO {

    private Long id;

    @NotBlank(message = "La razón social es obligatoria")
    @Size(max = 200)
    private String razonSocial;

    @NotBlank(message = "El CUIT es obligatorio")
    @Size(max = 20)
    private String cuit;

    // Constructores
    public PersonaJuridicaDTO() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public String getCuit() {
        return cuit;
    }

    public void setCuit(String cuit) {
        this.cuit = cuit;
    }
}
