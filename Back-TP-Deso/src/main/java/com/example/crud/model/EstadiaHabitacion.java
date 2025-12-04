package com.example.crud.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "estadia_habitaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    public EstadiaHabitacion(Estadia estadia, Habitacion habitacion, LocalDate fecha) {
        this.estadia = estadia;
        this.habitacion = habitacion;
        this.fecha = fecha;
    }
}
