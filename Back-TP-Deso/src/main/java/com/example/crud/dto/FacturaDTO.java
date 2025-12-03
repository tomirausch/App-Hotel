package com.example.crud.dto;

import com.example.crud.enums.TipoFactura;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class FacturaDTO {

    private Long id;

    @NotNull(message = "La fecha de emisión es obligatoria")
    private LocalDate fechaEmision;

    @NotNull(message = "La hora de emisión es obligatoria")
    private LocalTime horaEmision;

    @NotBlank(message = "El número es obligatorio")
    @Size(max = 50)
    private String numero;

    @Size(max = 10)
    private String iva;

    @NotNull(message = "El tipo de factura es obligatorio")
    private TipoFactura tipo;

    private Long idEstadia;

    private Long idHuesped;

    private Long idPersonaJuridica;

    private List<PagoDTO> pagos = new ArrayList<>();

    private List<NotaCreditoDTO> notasCredito = new ArrayList<>();

    // Constructores
    public FacturaDTO() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public LocalTime getHoraEmision() {
        return horaEmision;
    }

    public void setHoraEmision(LocalTime horaEmision) {
        this.horaEmision = horaEmision;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getIva() {
        return iva;
    }

    public void setIva(String iva) {
        this.iva = iva;
    }

    public TipoFactura getTipo() {
        return tipo;
    }

    public void setTipo(TipoFactura tipo) {
        this.tipo = tipo;
    }

    public Long getIdEstadia() {
        return idEstadia;
    }

    public void setIdEstadia(Long idEstadia) {
        this.idEstadia = idEstadia;
    }

    public Long getIdHuesped() {
        return idHuesped;
    }

    public void setIdHuesped(Long idHuesped) {
        this.idHuesped = idHuesped;
    }

    public Long getIdPersonaJuridica() {
        return idPersonaJuridica;
    }

    public void setIdPersonaJuridica(Long idPersonaJuridica) {
        this.idPersonaJuridica = idPersonaJuridica;
    }

    public List<PagoDTO> getPagos() {
        return pagos;
    }

    public void setPagos(List<PagoDTO> pagos) {
        this.pagos = pagos;
    }

    public List<NotaCreditoDTO> getNotasCredito() {
        return notasCredito;
    }

    public void setNotasCredito(List<NotaCreditoDTO> notasCredito) {
        this.notasCredito = notasCredito;
    }
}
