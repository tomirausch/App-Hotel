package com.example.crud.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "estadias")
public class Estadia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "estadia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EstadiaHabitacion> estadiaHabitaciones = new ArrayList<>();

    @Column(name = "costo_estadia", precision = 10, scale = 2)
    private BigDecimal costoEstadia;

    private Double descuento;

    @Column(name = "cant_personas")
    private Integer cantPersonas;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_huesped_responsable", nullable = false)
    private Huesped responsable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reserva_origen", nullable = true)
    private Reserva reservaOrigen;

    @ManyToMany
    @JoinTable(name = "estadia_acompanantes", joinColumns = @JoinColumn(name = "id_estadia"), inverseJoinColumns = @JoinColumn(name = "id_acompanante"))
    private List<Acompaniante> acompanantes = new ArrayList<>();

    public Estadia() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<EstadiaHabitacion> getEstadiaHabitaciones() {
        return estadiaHabitaciones;
    }

    public void setEstadiaHabitaciones(List<EstadiaHabitacion> estadiaHabitaciones) {
        this.estadiaHabitaciones = estadiaHabitaciones;
    }

    public void addEstadiaHabitacion(EstadiaHabitacion estadiaHabitacion) {
        estadiaHabitaciones.add(estadiaHabitacion);
        estadiaHabitacion.setEstadia(this);
    }

    public void removeEstadiaHabitacion(EstadiaHabitacion estadiaHabitacion) {
        estadiaHabitaciones.remove(estadiaHabitacion);
        estadiaHabitacion.setEstadia(null);
    }

    public BigDecimal getCostoEstadia() {
        return costoEstadia;
    }

    public void setCostoEstadia(BigDecimal costoEstadia) {
        this.costoEstadia = costoEstadia;
    }

    public Double getDescuento() {
        return descuento;
    }

    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }

    public Integer getCantPersonas() {
        return cantPersonas;
    }

    public void setCantPersonas(Integer cantPersonas) {
        this.cantPersonas = cantPersonas;
    }

    public Huesped getResponsable() {
        return responsable;
    }

    public void setResponsable(Huesped responsable) {
        this.responsable = responsable;
    }

    public List<Acompaniante> getAcompanantes() {
        return acompanantes;
    }

    public void setAcompanantes(List<Acompaniante> acompanantes) {
        this.acompanantes = acompanantes;
    }

    public Reserva getReservaOrigen() {
        return reservaOrigen;
    }

    public void setReservaOrigen(Reserva reservaOrigen) {
        this.reservaOrigen = reservaOrigen;
    }
}