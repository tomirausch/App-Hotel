package com.example.crud.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_huesped", nullable = false)
    private Huesped huesped;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservaHabitacion> reservaHabitaciones = new ArrayList<>();

    @Column(name = "monto", precision = 10, scale = 2)
    private BigDecimal monto;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Huesped getHuesped() {
        return huesped;
    }

    public void setHuesped(Huesped huesped) {
        this.huesped = huesped;
    }

    public List<ReservaHabitacion> getReservaHabitaciones() {
        return reservaHabitaciones;
    }

    public void setReservaHabitaciones(List<ReservaHabitacion> reservaHabitaciones) {
        this.reservaHabitaciones = reservaHabitaciones;
    }

    public void addReservaHabitacion(ReservaHabitacion reservaHabitacion) {
        reservaHabitaciones.add(reservaHabitacion);
        reservaHabitacion.setReserva(this);
    }

    public void removeReservaHabitacion(ReservaHabitacion reservaHabitacion) {
        reservaHabitaciones.remove(reservaHabitacion);
        reservaHabitacion.setReserva(null);
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
}