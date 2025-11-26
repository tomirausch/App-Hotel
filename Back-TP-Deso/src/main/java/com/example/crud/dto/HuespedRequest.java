package com.example.crud.dto;

import com.example.crud.model.PosicionIVA;
import com.example.crud.model.TipoDocumento;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class HuespedRequest {

    @NotBlank
    @Size(max = 60)
    private String nombre;

    @NotBlank
    @Size(max = 60)
    private String apellido;

    @NotNull
    private TipoDocumento tipoDocumento;

    @NotBlank
    @Size(max = 20)
    private String numeroDocumento;

    @NotNull
    @Past
    private LocalDate fechaNacimiento;

    @NotBlank
    @Size(max = 100)
    private String ocupacion;

    @NotBlank
    @Size(max = 10)
    private String codigoPostal;

    @NotBlank
    @Size(max = 80)
    private String localidad;

    @NotBlank
    @Size(max = 80)
    private String provincia;

    @NotBlank
    @Size(max = 80)
    private String pais;

    @Email
    @Size(max = 120)
    private String email;

    @NotBlank
    @Size(max = 80)
    private String nacionalidad;

    @NotNull
    private PosicionIVA posicionIVA;

    @Size(max = 20)
    private String cuit;          // opcional

    @NotBlank
    @Size(max = 30)
    private String telefono;

    @NotBlank
    @Size(max = 100)
    private String calle;

    @NotNull
    private Integer numero;

    @Size(max = 10)
    private String departamento;  // opcional

    @Min(0)
    private Integer piso;         // opcional

    // === Getters ===
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public TipoDocumento getTipoDocumento() { return tipoDocumento; }
    public String getNumeroDocumento() { return numeroDocumento; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public String getOcupacion() { return ocupacion; }
    public String getCodigoPostal() { return codigoPostal; }
    public String getLocalidad() { return localidad; }
    public String getProvincia() { return provincia; }
    public String getPais() { return pais; }
    public String getEmail() { return email; }
    public String getNacionalidad() { return nacionalidad; }
    public PosicionIVA getPosicionIVA() { return posicionIVA; }
    public String getCuit() { return cuit; }
    public String getTelefono() { return telefono; }
    public String getCalle() { return calle; }
    public Integer getNumero() { return numero; }
    public String getDepartamento() { return departamento; }
    public Integer getPiso() { return piso; }

    // === Setters ===
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public void setTipoDocumento(TipoDocumento tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public void setOcupacion(String ocupacion) { this.ocupacion = ocupacion; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }
    public void setLocalidad(String localidad) { this.localidad = localidad; }
    public void setProvincia(String provincia) { this.provincia = provincia; }
    public void setPais(String pais) { this.pais = pais; }
    public void setEmail(String email) { this.email = email; }
    public void setNacionalidad(String nacionalidad) { this.nacionalidad = nacionalidad; }
    public void setPosicionIVA(PosicionIVA posicionIVA) { this.posicionIVA = posicionIVA; }
    public void setCuit(String cuit) { this.cuit = cuit; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public void setCalle(String calle) { this.calle = calle; }
    public void setNumero(Integer numero) { this.numero = numero; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    public void setPiso(Integer piso) { this.piso = piso; }
}

