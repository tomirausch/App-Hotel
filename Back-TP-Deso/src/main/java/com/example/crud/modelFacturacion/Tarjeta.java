package com.example.crud.modelFacturacion;

import com.example.crud.enums.TipoTarjeta;
import com.example.crud.enums.MarcaTarjeta;
import jakarta.persistence.*;

@Entity
@Table(name = "tarjetas")
@PrimaryKeyJoinColumn(name = "id_metodo_pago")
public class Tarjeta extends MetodoPago {

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_tarjeta", length = 20)
    private TipoTarjeta tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "marca_tarjeta", length = 20)
    private MarcaTarjeta marca;

    @Column(name = "numero_tarjeta", length = 20)
    private String numero;

    // Constructores
    public Tarjeta() {
    }

    // Getters y Setters
    public TipoTarjeta getTipo() {
        return tipo;
    }

    public void setTipo(TipoTarjeta tipo) {
        this.tipo = tipo;
    }

    public MarcaTarjeta getMarca() {
        return marca;
    }

    public void setMarca(MarcaTarjeta marca) {
        this.marca = marca;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }
}
