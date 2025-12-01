package com.example.crud.modelFacturacion;

import com.example.crud.enums.TipoFactura;
import com.example.crud.model.Estadia;
import com.example.crud.model.Huesped;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "facturas")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_factura")
    private Long id;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "hora_emision")
    private LocalTime horaEmision;

    @Column(name = "numero", length = 50)
    private String numero;

    @Column(name = "iva", length = 10)
    private String iva;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", length = 20)
    private TipoFactura tipo;

    // Relación 1:N con LineaFactura
    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LineaFactura> lineasFactura = new ArrayList<>();

    // Relación 1:N con NotaCredito
    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotaCredito> notasCredito = new ArrayList<>();

    // Relación 1:N con Pago
    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pago> pagos = new ArrayList<>();

    // Relación N:1 con Estadia
    @ManyToOne
    @JoinColumn(name = "id_estadia")
    private Estadia estadia;

    // Relación polimórfica con Persona (Huesped o PersonaJuridica)
    // La factura puede ser de un Huesped o de una PersonaJuridica
    @ManyToOne
    @JoinColumn(name = "id_huesped")
    private Huesped huesped;

    @ManyToOne
    @JoinColumn(name = "id_persona_juridica")
    private PersonaJuridica personaJuridica;

    // Constructores
    public Factura() {
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

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getIva() {
        return iva;
    }

    public void setIva(String iva) {
        this.iva = iva;
    }

    public TipoFactura getTipo() {
        return tipo;
    }

    public void setTipo(TipoFactura tipo) {
        this.tipo = tipo;
    }

    public List<LineaFactura> getLineasFactura() {
        return lineasFactura;
    }

    public void setLineasFactura(List<LineaFactura> lineasFactura) {
        this.lineasFactura = lineasFactura;
    }

    public List<NotaCredito> getNotasCredito() {
        return notasCredito;
    }

    public void setNotasCredito(List<NotaCredito> notasCredito) {
        this.notasCredito = notasCredito;
    }

    public List<Pago> getPagos() {
        return pagos;
    }

    public void setPagos(List<Pago> pagos) {
        this.pagos = pagos;
    }

    public Estadia getEstadia() {
        return estadia;
    }

    public void setEstadia(Estadia estadia) {
        this.estadia = estadia;
    }

    public Huesped getHuesped() {
        return huesped;
    }

    public void setHuesped(Huesped huesped) {
        this.huesped = huesped;
    }

    public PersonaJuridica getPersonaJuridica() {
        return personaJuridica;
    }

    public void setPersonaJuridica(PersonaJuridica personaJuridica) {
        this.personaJuridica = personaJuridica;
    }
}
