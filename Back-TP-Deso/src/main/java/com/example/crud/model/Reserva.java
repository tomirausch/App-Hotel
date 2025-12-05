package com.example.crud.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

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

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_habitacion", nullable = false)
    private Habitacion habitacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private com.example.crud.enums.EstadoReserva estado;

    @Column(name = "fecha_desde", nullable = false)
    private java.time.LocalDate fechaDesde;

    @Column(name = "fecha_hasta", nullable = false)
    private java.time.LocalDate fechaHasta;

    @Column(name = "monto", precision = 10, scale = 2)
    private BigDecimal monto;
}
