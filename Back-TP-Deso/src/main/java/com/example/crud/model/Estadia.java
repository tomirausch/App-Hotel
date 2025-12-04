package com.example.crud.model;

import com.example.crud.modelFacturacion.Factura;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "estadias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    // Relación 1:N con Factura
    @OneToMany(mappedBy = "estadia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Factura> facturas = new ArrayList<>();

    // Relación N:N con Servicio
    @OneToMany(mappedBy = "estadia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EstadiaServicio> estadiaServicios = new ArrayList<>();

    public void addEstadiaHabitacion(EstadiaHabitacion estadiaHabitacion) {
        estadiaHabitaciones.add(estadiaHabitacion);
        estadiaHabitacion.setEstadia(this);
    }

    public void removeEstadiaHabitacion(EstadiaHabitacion estadiaHabitacion) {
        estadiaHabitaciones.remove(estadiaHabitacion);
        estadiaHabitacion.setEstadia(null);
    }
}
