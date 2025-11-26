package com.example.crud.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class OcuparHabitacionRequest {

    @NotNull(message = "El ID de la habitación es obligatorio")
    private Long idHabitacion;

    @NotNull(message = "El ID del huésped responsable es obligatorio")
    private Long idHuespedResponsable;


    @Valid
    private List<DatosAcompaniante> acompanantes;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDate fechaFin;

    // Getters y Setters
    public Long getIdHabitacion() { return idHabitacion; }
    public void setIdHabitacion(Long idHabitacion) { this.idHabitacion = idHabitacion; }

    public Long getIdHuespedResponsable() { return idHuespedResponsable; }
    public void setIdHuespedResponsable(Long idHuespedResponsable) { this.idHuespedResponsable = idHuespedResponsable; }

    public List<DatosAcompaniante> getAcompanantes() { return acompanantes; }
    public void setAcompanantes(List<DatosAcompaniante> acompanantes) { this.acompanantes = acompanantes; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
}