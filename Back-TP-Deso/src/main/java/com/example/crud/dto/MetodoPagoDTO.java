package com.example.crud.dto;

public class MetodoPagoDTO {

    private Long id;

    private String tipoMetodo; // "TARJETA", "EFECTIVO", "CHEQUE"

    private Long idPago;

    // Constructores
    public MetodoPagoDTO() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoMetodo() {
        return tipoMetodo;
    }

    public void setTipoMetodo(String tipoMetodo) {
        this.tipoMetodo = tipoMetodo;
    }

    public Long getIdPago() {
        return idPago;
    }

    public void setIdPago(Long idPago) {
        this.idPago = idPago;
    }
}
