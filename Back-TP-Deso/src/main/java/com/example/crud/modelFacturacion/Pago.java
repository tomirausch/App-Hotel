/*package com.example.crud.modelFacturacion;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pagos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long id;

    @Column(name = "importe")
    private Float importe;

    // Relación N:1 con Factura
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_factura", nullable = false)
    private Factura factura;

    // Relación 1:N con MetodoPago
    @OneToMany(mappedBy = "pago", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MetodoPago> metodosPago = new ArrayList<>();
}
*/