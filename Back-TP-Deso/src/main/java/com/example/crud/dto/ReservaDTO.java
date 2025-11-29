package com.example.crud.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ReservaDTO {

    @NotEmpty(message = "Debe seleccionar al menos una habitación")
    private List<ReservaDetalleDTO> detalles;

    @NotNull
    @Valid
    private HuespedReservaDTO datosHuesped;

    // Getters y Setters
    public List<ReservaDetalleDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<ReservaDetalleDTO> detalles) {
        this.detalles = detalles;
    }

    public HuespedReservaDTO getDatosHuesped() {
        return datosHuesped;
    }

    public void setDatosHuesped(HuespedReservaDTO datosHuesped) {
        this.datosHuesped = datosHuesped;
    }
}
