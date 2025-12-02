package com.example.crud.dto;

import com.example.crud.enums.TipoDocumento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AcompanianteDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 60)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 60)
    private String apellido;

    @NotNull(message = "El tipo de documento es obligatorio")
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "El número de documento es obligatorio")
    @Size(max = 20)
    private String numeroDocumento;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }
}
