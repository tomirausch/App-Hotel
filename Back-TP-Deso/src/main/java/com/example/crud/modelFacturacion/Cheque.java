package com.example.crud.modelFacturacion;

import com.example.crud.enums.TipoCheque;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cheques")
@PrimaryKeyJoinColumn(name = "id_metodo_pago")
public class Cheque extends MetodoPago {

    @Column(name = "numero_cheque", length = 50)
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cheque", length = 20)
    private TipoCheque tipo;

    @Column(name = "plaza", length = 100)
    private String plaza;

    @Column(name = "fecha_cobro")
    private LocalDate fechaCobro;

    @Column(name = "banco", length = 100)
    private String banco;

    // Constructores
    public Cheque() {
    }

    // Getters y Setters
    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public TipoCheque getTipo() {
        return tipo;
    }

    public void setTipo(TipoCheque tipo) {
        this.tipo = tipo;
    }

    public String getPlaza() {
        return plaza;
    }

    public void setPlaza(String plaza) {
        this.plaza = plaza;
    }

    public LocalDate getFechaCobro() {
        return fechaCobro;
    }

    public void setFechaCobro(LocalDate fechaCobro) {
        this.fechaCobro = fechaCobro;
    }

    public String getBanco() {
        return banco;
    }

    public void setBanco(String banco) {
        this.banco = banco;
    }
}
