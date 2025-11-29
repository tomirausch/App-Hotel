package com.example.crud.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reserva_habitaciones")
public class ReservaHabitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_reserva", nullable = false)
    private Reserva reserva;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_habitacion", nullable = false)
    private Habitacion habitacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private EstadoReserva estado;

    @Column(name = "fecha")
    private LocalDate fecha;

    public ReservaHabitacion() {
    }

    public ReservaHabitacion(Reserva reserva, Habitacion habitacion, EstadoReserva estado, LocalDate fecha) {
        this.reserva = reserva;
        this.habitacion = habitacion;
        this.estado = estado;
        this.fecha = fecha;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Reserva getReserva() {
        return reserva;
    }

    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }

    public Habitacion getHabitacion() {
        return habitacion;
    }

    public void setHabitacion(Habitacion habitacion) {
        this.habitacion = habitacion;
    }

    public EstadoReserva getEstado() {
        return estado;
    }

    public void setEstado(EstadoReserva estado) {
        this.estado = estado;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}
