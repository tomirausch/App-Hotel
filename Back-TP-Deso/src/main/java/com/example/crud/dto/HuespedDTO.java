package com.example.crud.dto;

import com.example.crud.model.PosicionIVA;
import com.example.crud.model.TipoDocumento;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class HuespedDTO {

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

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "La ocupación es obligatoria")
    @Size(max = 100)
    private String ocupacion;

    @NotBlank(message = "El código postal es obligatorio")
    @Size(max = 10)
    private String codigoPostal;

    @NotBlank(message = "La localidad es obligatoria")
    @Size(max = 80)
    private String localidad;

    @NotBlank(message = "La provincia es obligatoria")
    @Size(max = 80)
    private String provincia;

    @NotBlank(message = "El país es obligatorio")
    @Size(max = 80)
    private String pais;

    @Email(message = "El email debe ser válido")
    @Size(max = 120)
    private String email;

    @NotBlank(message = "La nacionalidad es obligatoria")
    @Size(max = 80)
    private String nacionalidad;

    @NotNull(message = "La posición IVA es obligatoria")
    private PosicionIVA posicionIVA;

    @Size(max = 20)
    private String cuit;

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 30)
    private String telefono;

    @NotBlank(message = "La calle es obligatoria")
    @Size(max = 100)
    private String calle;

    @NotNull(message = "El número es obligatorio")
    private Integer numero;

    @Size(max = 10)
    private String departamento;

    @Min(0)
    private Integer piso;

    // Helper method for search criteria
    public boolean sinCriterios() {
        return (apellido == null || apellido.isBlank()) &&
                (nombre == null || nombre.isBlank()) &&
                tipoDocumento == null &&
                (numeroDocumento == null || numeroDocumento.isBlank());
    }

    // Getters and Setters

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

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getOcupacion() {
        return ocupacion;
    }

    public void setOcupacion(String ocupacion) {
        this.ocupacion = ocupacion;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getLocalidad() {
        return localidad;
    }

    public void setLocalidad(String localidad) {
        this.localidad = localidad;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }

    public PosicionIVA getPosicionIVA() {
        return posicionIVA;
    }

    public void setPosicionIVA(PosicionIVA posicionIVA) {
        this.posicionIVA = posicionIVA;
    }

    public String getCuit() {
        return cuit;
    }

    public void setCuit(String cuit) {
        this.cuit = cuit;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public Integer getPiso() {
        return piso;
    }

    public void setPiso(Integer piso) {
        this.piso = piso;
    }
}
