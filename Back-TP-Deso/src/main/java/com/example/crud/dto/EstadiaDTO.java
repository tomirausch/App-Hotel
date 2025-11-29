package com.example.crud.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class EstadiaDTO {

    private Long id;

    @NotNull(message = "El ID del huésped responsable es obligatorio")
    private Long idHuespedResponsable;

    @Valid
    @NotEmpty(message = "Debe incluir al menos un detalle de habitación y fecha")
    private List<EstadiaDetalleDTO> detalles;

    @Valid
    private List<AcompanianteDTO> acompanantes;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdHuespedResponsable() {
        return idHuespedResponsable;
    }

    public void setIdHuespedResponsable(Long idHuespedResponsable) {
        this.idHuespedResponsable = idHuespedResponsable;
    }

    public List<EstadiaDetalleDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<EstadiaDetalleDTO> detalles) {
        this.detalles = detalles;
    }

    public List<AcompanianteDTO> getAcompanantes() {
        return acompanantes;
    }

    public void setAcompanantes(List<AcompanianteDTO> acompanantes) {
        this.acompanantes = acompanantes;
    }
}
