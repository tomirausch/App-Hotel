package com.example.crud.modelFacturacion;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "notas_credito")
public class NotaCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nota_credito")
    private Long id;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "hora_emision")
    private LocalTime horaEmision;

    // Relación N:1 con Factura
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_factura", nullable = false)
    private Factura factura;

    // Constructores
    public NotaCredito() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public LocalTime getHoraEmision() {
        return horaEmision;
    }

    public void setHoraEmision(LocalTime horaEmision) {
        this.horaEmision = horaEmision;
    }

    public Factura getFactura() {
        return factura;
    }

    public void setFactura(Factura factura) {
        this.factura = factura;
    }
}
