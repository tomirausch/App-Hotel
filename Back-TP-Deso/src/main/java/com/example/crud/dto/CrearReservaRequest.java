package com.example.crud.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class CrearReservaRequest {

    @NotEmpty(message = "Debe seleccionar al menos una habitación")
    private List<Long> idsHabitaciones;

    @NotNull @FutureOrPresent
    private LocalDate fechaDesde;

    @NotNull @FutureOrPresent
    private LocalDate fechaHasta;

    @NotNull @Valid
    private DatosContacto datosHuesped;

    // Getters y Setters
    public List<Long> getIdsHabitaciones() { return idsHabitaciones; }
    public void setIdsHabitaciones(List<Long> idsHabitaciones) { this.idsHabitaciones = idsHabitaciones; }
    public LocalDate getFechaDesde() { return fechaDesde; }
    public void setFechaDesde(LocalDate fechaDesde) { this.fechaDesde = fechaDesde; }
    public LocalDate getFechaHasta() { return fechaHasta; }
    public void setFechaHasta(LocalDate fechaHasta) { this.fechaHasta = fechaHasta; }
    public DatosContacto getDatosHuesped() { return datosHuesped; }
    public void setDatosHuesped(DatosContacto datosHuesped) { this.datosHuesped = datosHuesped; }
}