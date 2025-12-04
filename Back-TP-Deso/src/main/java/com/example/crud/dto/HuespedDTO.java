package com.example.crud.dto;

import com.example.crud.enums.PosicionIVA;
import com.example.crud.enums.TipoDocumento;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
