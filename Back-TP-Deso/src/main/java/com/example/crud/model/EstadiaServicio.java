package com.example.crud.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "estadia_servicio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstadiaServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estadia_servicio")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_estadia", nullable = false)
    private Estadia estadia;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_servicio", nullable = false)
    private Servicio servicio;

    @Column(name = "fecha")
    private LocalDate fecha;

    public EstadiaServicio(Estadia estadia, Servicio servicio, LocalDate fecha) {
        this.estadia = estadia;
        this.servicio = servicio;
        this.fecha = fecha;
    }
}
