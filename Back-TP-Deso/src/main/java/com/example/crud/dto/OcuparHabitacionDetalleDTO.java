package com.example.crud.dto;

import com.example.crud.model.EstadoHabitacion;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class OcuparHabitacionDetalleDTO {

    @NotNull(message = "El ID de la habitación es obligatorio")
    private Long idHabitacion;

    @NotNull(message = "El estado es obligatorio")
    private EstadoHabitacion estado;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    // Null si estado es DISPONIBLE
    private Long idReserva;

    // Null si estado es DISPONIBLE
    private Long idHuespedResponsableReserva;

    public OcuparHabitacionDetalleDTO() {
    }

    // Getters y Setters
    public Long getIdHabitacion() {
        return idHabitacion;
    }

    public void setIdHabitacion(Long idHabitacion) {
        this.idHabitacion = idHabitacion;
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

    public Long getIdHuespedResponsableReserva() {
        return idHuespedResponsableReserva;
    }

    public void setIdHuespedResponsableReserva(Long idHuespedResponsableReserva) {
        this.idHuespedResponsableReserva = idHuespedResponsableReserva;
    }
}
