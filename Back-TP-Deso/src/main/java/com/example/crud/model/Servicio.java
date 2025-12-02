package com.example.crud.model;

import jakarta.persistence.*;

@Entity
@Table(name = "servicios")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Long id;

    @Column(name = "nombre", length = 100)
    private String nombre;

    @Column(name = "precio_unidad")
    private Float precioUnidad;

    @Column(name = "detalle", length = 255)
    private String detalle;

    // Constructores
    public Servicio() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Float getPrecioUnidad() {
        return precioUnidad;
    }

    public void setPrecioUnidad(Float precioUnidad) {
        this.precioUnidad = precioUnidad;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }
}
