package com.example.crud.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "huespedes")
public class Huesped extends Persona {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max=60) private String nombre;
    @NotBlank @Size(max=60) private String apellido;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El tipo de documento es obligatorio") // CORREGIDO: @NotNull en vez de @NotBlank
    @Column(name="tipo_documento", nullable=false, length=16) // CORREGIDO: nullable=false
    private TipoDocumento tipoDocumento;

    @Size(max=20)
    @NotBlank(message = "El número de documento es obligatorio")
    @Column(name="numero_documento", nullable=false, length=20) // CORREGIDO: nullable=false
    private String numeroDocumento;

    // ... (El resto de atributos y Getters/Setters están perfectos) ...
    @Past @Column(name="fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Size(max=100) private String ocupacion;
    @Size(max=10)  @Column(name="codigo_postal") private String codigoPostal;
    @Size(max=80)  private String localidad;
    @Size(max=80)  private String provincia;
    @Size(max=80)  private String pais;
    @Email @Size(max=120) private String email;
    @Size(max=80)  private String nacionalidad;

    @Enumerated(EnumType.STRING)
    @Column(name="posicion_iva", length=30)
    private PosicionIVA posicionIVA;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public TipoDocumento getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(TipoDocumento tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getNumeroDocumento() { return numeroDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public String getOcupacion() { return ocupacion; }
    public void setOcupacion(String ocupacion) { this.ocupacion = ocupacion; }
    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }
    public String getLocalidad() { return localidad; }
    public void setLocalidad(String localidad) { this.localidad = localidad; }
    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }
    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getNacionalidad() { return nacionalidad; }
    public void setNacionalidad(String nacionalidad) { this.nacionalidad = nacionalidad; }
    public PosicionIVA getPosicionIVA() { return posicionIVA; }
    public void setPosicionIVA(PosicionIVA posicionIVA) { this.posicionIVA = posicionIVA; }
}