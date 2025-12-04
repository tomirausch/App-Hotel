package com.example.crud.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    public void addReservaHabitacion(ReservaHabitacion reservaHabitacion) {
        reservaHabitaciones.add(reservaHabitacion);
        reservaHabitacion.setReserva(this);
    }

    public void removeReservaHabitacion(ReservaHabitacion reservaHabitacion) {
        reservaHabitaciones.remove(reservaHabitacion);
        reservaHabitacion.setReserva(null);
    }
}
