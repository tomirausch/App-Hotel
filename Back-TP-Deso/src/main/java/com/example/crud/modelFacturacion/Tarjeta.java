package com.example.crud.modelFacturacion;

import com.example.crud.enums.TipoTarjeta;
import com.example.crud.enums.MarcaTarjeta;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "tarjetas")
@PrimaryKeyJoinColumn(name = "id_metodo_pago")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tarjeta extends MetodoPago {

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_tarjeta", length = 20)
    private TipoTarjeta tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "marca_tarjeta", length = 20)
    private MarcaTarjeta marca;

    @Column(name = "numero_tarjeta", length = 20)
    private String numero;
}
