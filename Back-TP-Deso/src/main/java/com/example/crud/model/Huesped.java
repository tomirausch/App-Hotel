package com.example.crud.model;

import com.example.crud.enums.TipoDocumento;
import com.example.crud.enums.PosicionIVA;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "huespedes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Huesped extends Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 60)
    private String nombre;
    @NotBlank
    @Size(max = 60)
    private String apellido;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El tipo de documento es obligatorio") // CORREGIDO: @NotNull en vez de @NotBlank
    @Column(name = "tipo_documento", nullable = false, length = 16) // CORREGIDO: nullable=false
    private TipoDocumento tipoDocumento;

    @Size(max = 20)
    @NotBlank(message = "El número de documento es obligatorio")
    @Column(name = "numero_documento", nullable = false, length = 20) // CORREGIDO: nullable=false
    private String numeroDocumento;

    @Past
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Size(max = 100)
    private String ocupacion;
    @Size(max = 10)
    @Column(name = "codigo_postal")
    private String codigoPostal;
    @Size(max = 80)
    private String localidad;
    @Size(max = 80)
    private String provincia;
    @Size(max = 80)
    private String pais;
    @Email
    @Size(max = 120)
    private String email;
    @Size(max = 80)
    private String nacionalidad;

    @Enumerated(EnumType.STRING)
    @Column(name = "posicion_iva", length = 30)
    private PosicionIVA posicionIVA;
}
