package com.example.crud.dto;

import com.example.crud.model.TipoDocumento;

public class BuscarHuespedRequest {

    private String apellido;
    private String nombre;
    private TipoDocumento tipoDocumento;
    private String numeroDocumento;

    // Getters
    public String getApellido() { return apellido; }
    public String getNombre() { return nombre; }
    public TipoDocumento getTipoDocumento() { return tipoDocumento; }
    public String getNumeroDocumento() { return numeroDocumento; }

    // Setters
    public void setApellido(String apellido) { this.apellido = apellido; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setTipoDocumento(TipoDocumento tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }

    public boolean sinCriterios() {
        return (apellido == null || apellido.isBlank()) &&
                (nombre == null || nombre.isBlank()) &&
                tipoDocumento == null &&
                (numeroDocumento == null || numeroDocumento.isBlank());
    }
}
