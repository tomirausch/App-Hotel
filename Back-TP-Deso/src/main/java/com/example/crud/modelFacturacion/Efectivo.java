package com.example.crud.modelFacturacion;

import com.example.crud.enums.TipoMoneda;
import jakarta.persistence.*;

@Entity
@Table(name = "efectivos")
@PrimaryKeyJoinColumn(name = "id_metodo_pago")
public class Efectivo extends MetodoPago {

    @Enumerated(EnumType.STRING)
    @Column(name = "moneda", length = 30)
    private TipoMoneda moneda;

    @Column(name = "cotizacion", length = 50)
    private String cotizacion;

    // Constructores
    public Efectivo() {
    }

    // Getters y Setters
    public TipoMoneda getMoneda() {
        return moneda;
    }

    public void setMoneda(TipoMoneda moneda) {
        this.moneda = moneda;
    }

    public String getCotizacion() {
        return cotizacion;
    }

    public void setCotizacion(String cotizacion) {
        this.cotizacion = cotizacion;
    }
}
