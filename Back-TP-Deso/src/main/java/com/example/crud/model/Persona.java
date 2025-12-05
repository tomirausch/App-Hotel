package com.example.crud.model;

import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Persona {
    @Size(max = 20)
    protected String cuit;
    @Size(max = 30)
    protected String telefono;
    @Size(max = 100)
    protected String calle;
    protected Integer numero;
    @Size(max = 10)
    protected String departamento;
    protected Integer piso;
}
