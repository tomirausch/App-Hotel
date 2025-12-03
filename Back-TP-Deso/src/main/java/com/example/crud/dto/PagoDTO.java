package com.example.crud.dto;

import jakarta.validation.constraints.*;
import java.util.ArrayList;
import java.util.List;

public class PagoDTO {

    private Long id;

    @NotNull(message = "El importe es obligatorio")
    private Float importe;

    @NotNull(message = "El ID de la factura es obligatorio")
    private Long idFactura;

    private List<MetodoPagoDTO> metodos = new ArrayList<>();

    // Constructores
    public PagoDTO() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getImporte() {
        return importe;
    }

    public void setImporte(Float importe) {
        this.importe = importe;
    }

    public Long getIdFactura() {
        return idFactura;
    }

    public void setIdFactura(Long idFactura) {
        this.idFactura = idFactura;
    }

    public List<MetodoPagoDTO> getMetodos() {
        return metodos;
    }

    public void setMetodos(List<MetodoPagoDTO> metodos) {
        this.metodos = metodos;
    }
}
