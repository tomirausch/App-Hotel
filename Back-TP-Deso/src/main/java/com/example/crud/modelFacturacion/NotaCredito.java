package com.example.crud.modelFacturacion;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "notas_credito")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotaCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nota_credito")
    private Long id;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "hora_emision")
    private LocalTime horaEmision;

    // Relación N:1 con Factura
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_factura", nullable = false)
    private Factura factura;
}
