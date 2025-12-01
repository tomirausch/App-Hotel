package com.example.crud.modelFacturacion;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "lineas_factura")
public class LineaFactura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_linea_factura")
    private Long id;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "importe", precision = 10, scale = 2)
    private BigDecimal importe;

    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "iva", length = 10)
    private String iva;

    @Column(name = "cantidad")
    private Integer cantidad;

    // Relación N:1 con Factura
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_factura", nullable = false)
    private Factura factura;

    // Constructores
    public LineaFactura() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getImporte() {
        return importe;
    }

    public void setImporte(BigDecimal importe) {
        this.importe = importe;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public String getIva() {
        return iva;
    }

    public void setIva(String iva) {
        this.iva = iva;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Factura getFactura() {
        return factura;
    }

    public void setFactura(Factura factura) {
        this.factura = factura;
    }
}
