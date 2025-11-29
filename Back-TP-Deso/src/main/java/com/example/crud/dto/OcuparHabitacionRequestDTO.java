package com.example.crud.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class OcuparHabitacionRequestDTO {

    @Valid
    @NotEmpty(message = "Debe incluir al menos un detalle de habitación")
    private List<OcuparHabitacionDetalleDTO> detalles;

    @NotNull(message = "El ID del huésped responsable es obligatorio")
    private Long idHuespedResponsableEstadia;

    // IDs de acompañantes existentes (opcional)
    private List<Long> listaAcompanantes;

    public OcuparHabitacionRequestDTO() {
    }

    // Getters y Setters
    public List<OcuparHabitacionDetalleDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<OcuparHabitacionDetalleDTO> detalles) {
        this.detalles = detalles;
    }

    public Long getIdHuespedResponsableEstadia() {
        return idHuespedResponsableEstadia;
    }

    public void setIdHuespedResponsableEstadia(Long idHuespedResponsableEstadia) {
        this.idHuespedResponsableEstadia = idHuespedResponsableEstadia;
    }

    public List<Long> getListaAcompanantes() {
        return listaAcompanantes;
    }

    public void setListaAcompanantes(List<Long> listaAcompanantes) {
        this.listaAcompanantes = listaAcompanantes;
    }
}
