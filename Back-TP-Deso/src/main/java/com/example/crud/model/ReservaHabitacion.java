package com.example.crud.model;

import com.example.crud.enums.EstadoReserva;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "reserva_habitaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    public ReservaHabitacion(Reserva reserva, Habitacion habitacion, EstadoReserva estado, LocalDate fecha) {
        this.reserva = reserva;
        this.habitacion = habitacion;
        this.estado = estado;
        this.fecha = fecha;
    }
}
