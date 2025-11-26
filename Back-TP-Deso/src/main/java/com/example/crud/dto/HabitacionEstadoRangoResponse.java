package com.example.crud.dto;

import com.example.crud.model.EstadoHabitacion;

import java.math.BigDecimal;

public class HabitacionEstadoRangoResponse {

    private Long id;
    private Integer numero;
    private Integer piso;
    private String tipoHabitacion;
    private BigDecimal costo;

    // Estado de la habitación EN EL RANGO solicitado
    // Por ahora: DISPONIBLE o RESERVADA.
    // En el futuro, cuando modeles Estadía, podremos devolver también OCUPADA.
    private EstadoHabitacion estadoEnRango;

    // Getters / setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }

    public Integer getPiso() { return piso; }
    public void setPiso(Integer piso) { this.piso = piso; }

    public String getTipoHabitacion() { return tipoHabitacion; }
    public void setTipoHabitacion(String tipoHabitacion) { this.tipoHabitacion = tipoHabitacion; }

    public BigDecimal getCosto() { return costo; }
    public void setCosto(BigDecimal costo) { this.costo = costo; }

    public EstadoHabitacion getEstadoEnRango() { return estadoEnRango; }
    public void setEstadoEnRango(EstadoHabitacion estadoEnRango) { this.estadoEnRango = estadoEnRango; }
}
