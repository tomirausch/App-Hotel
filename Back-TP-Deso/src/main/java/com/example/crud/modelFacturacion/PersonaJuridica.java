package com.example.crud.modelFacturacion;

import com.example.crud.model.Persona;
import jakarta.persistence.*;

@Entity
@Table(name = "personas_juridicas")
public class PersonaJuridica extends Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_persona_juridica")
    private Long id;

    @Column(name = "razon_social", length = 200)
    private String razonSocial;

    // Constructores
    public PersonaJuridica() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }
}
