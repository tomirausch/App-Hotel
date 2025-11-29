package com.example.crud.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "estadia_habitaciones")
public class EstadiaHabitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_estadia", nullable = false)
    private Estadia estadia;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_habitacion", nullable = false)
    private Habitacion habitacion;

    @Column(name = "fecha")
    private LocalDate fecha;

    public EstadiaHabitacion() {
    }

    public EstadiaHabitacion(Estadia estadia, Habitacion habitacion, LocalDate fecha) {
        this.estadia = estadia;
        this.habitacion = habitacion;
        this.fecha = fecha;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Estadia getEstadia() {
        return estadia;
    }

    public void setEstadia(Estadia estadia) {
        this.estadia = estadia;
    }

    public Habitacion getHabitacion() {
        return habitacion;
    }

    public void setHabitacion(Habitacion habitacion) {
        this.habitacion = habitacion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}
