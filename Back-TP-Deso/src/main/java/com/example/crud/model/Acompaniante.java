package com.example.crud.model;

import com.example.crud.enums.TipoDocumento;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "acompanantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Acompaniante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 60)
    private String nombre;

    @NotBlank
    @Size(max = 60)
    private String apellido;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento")
    private TipoDocumento tipoDocumento;

    @NotBlank
    @Size(max = 20)
    @Column(name = "numero_documento")
    private String numeroDocumento;
}
