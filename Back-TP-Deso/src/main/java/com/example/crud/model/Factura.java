package com.example.crud.model;

import com.example.crud.enums.TipoFactura;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "facturas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_factura")
    private Long id;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "hora_emision")
    private LocalTime horaEmision;

    @Column(name = "iva", length = 10)
    private String iva;

    @Column(name = "monto_total")
    private Double montoTotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_moneda", length = 20)
    private com.example.crud.enums.TipoMoneda tipoMoneda;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", length = 20)
    private TipoFactura tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private com.example.crud.enums.EstadoFactura estado;

    // Relación 1:N con LineaFactura
    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LineaFactura> lineasFactura = new ArrayList<>();

    // Relación N:1 con Estadia
    @ManyToOne
    @JoinColumn(name = "id_estadia")
    private Estadia estadia;

    // Relación polimórfica con Persona (Huesped o PersonaJuridica)
    // La factura puede ser de un Huesped o de una PersonaJuridica
    @ManyToOne
    @JoinColumn(name = "id_huesped")
    private Huesped huesped;

    @ManyToOne
    @JoinColumn(name = "id_persona_juridica")
    private PersonaJuridica personaJuridica;
}
