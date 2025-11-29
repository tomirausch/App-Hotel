package com.example.crud.dto;

import com.example.crud.model.EstadoHabitacion;

import java.math.BigDecimal;
import java.time.LocalDate;

public class HabitacionDTO {

    private Long id;
    private Integer numero;
    private Integer piso;
    private String tipoHabitacion;
    private BigDecimal costo;
    private EstadoHabitacion estado;
    private LocalDate fecha; // Opcional: usado solo en consultas de estado diario

    // Campos opcionales: solo cuando está reservada
    private Long idReserva;
    private Long idHuespedResponsable;

    // Constructor vacío
    public HabitacionDTO() {
    }

    // Constructor para estado diario (con fecha)
    public HabitacionDTO(Long id, Integer numero, String tipoHabitacion, LocalDate fecha, EstadoHabitacion estado) {
        this.id = id;
        this.numero = numero;
        this.tipoHabitacion = tipoHabitacion;
        this.fecha = fecha;
        this.estado = estado;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public Integer getPiso() {
        return piso;
    }

    public void setPiso(Integer piso) {
        this.piso = piso;
    }

    public String getTipoHabitacion() {
        return tipoHabitacion;
    }

    public void setTipoHabitacion(String tipoHabitacion) {
        this.tipoHabitacion = tipoHabitacion;
    }

    public BigDecimal getCosto() {
        return costo;
    }

    public void setCosto(BigDecimal costo) {
        this.costo = costo;
    }

    public EstadoHabitacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoHabitacion estado) {
        this.estado = estado;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public Long getIdHuespedResponsable() {
        return idHuespedResponsable;
    }

    public void setIdHuespedResponsable(Long idHuespedResponsable) {
        this.idHuespedResponsable = idHuespedResponsable;
    }
}
