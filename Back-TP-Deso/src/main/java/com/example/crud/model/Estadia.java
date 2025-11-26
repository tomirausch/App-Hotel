package com.example.crud.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "estadias")
public class Estadia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull @Column(name = "fecha_inicio") private LocalDate fechaInicio;
    @NotNull @Column(name = "fecha_fin") private LocalDate fechaFin;
    private Double descuento;
    @Column(name = "cant_personas") private Integer cantPersonas;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_habitacion", nullable = false)
    private Habitacion habitacion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_huesped_responsable", nullable = false)
    private Huesped responsable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reserva_origen", nullable = true) // Puede ser nulo si vino sin reserva
    private Reserva reservaOrigen;

    @ManyToMany
    @JoinTable(
            name = "estadia_acompanantes",
            joinColumns = @JoinColumn(name = "id_estadia"),
            inverseJoinColumns = @JoinColumn(name = "id_acompanante")
    )
    private List<Acompaniante> acompanantes = new ArrayList<>();

    public Estadia() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }
    public Integer getCantPersonas() { return cantPersonas; }
    public void setCantPersonas(Integer cantPersonas) { this.cantPersonas = cantPersonas; }
    public Habitacion getHabitacion() { return habitacion; }
    public void setHabitacion(Habitacion habitacion) { this.habitacion = habitacion; }
    public Huesped getResponsable() { return responsable; }
    public void setResponsable(Huesped responsable) { this.responsable = responsable; }
    public List<Acompaniante> getAcompanantes() { return acompanantes; }
    public void setAcompanantes(List<Acompaniante> acompanantes) { this.acompanantes = acompanantes; }

    // Getter y Setter nuevo
    public Reserva getReservaOrigen() { return reservaOrigen; }
    public void setReservaOrigen(Reserva reservaOrigen) { this.reservaOrigen = reservaOrigen; }
}