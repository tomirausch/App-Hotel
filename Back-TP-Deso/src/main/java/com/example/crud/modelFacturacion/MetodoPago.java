package com.example.crud.modelFacturacion;

import jakarta.persistence.*;

@Entity
@Table(name = "metodos_pago")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metodo_pago")
    private Long id;

    // Relación N:1 con Pago
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_pago", nullable = false)
    private Pago pago;

    // Constructores
    public MetodoPago() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pago getPago() {
        return pago;
    }

    public void setPago(Pago pago) {
        this.pago = pago;
    }
}
