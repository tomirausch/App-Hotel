package com.example.crud.modelFacturacion;

import com.example.crud.enums.TipoMoneda;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "efectivos")
@PrimaryKeyJoinColumn(name = "id_metodo_pago")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Efectivo extends MetodoPago {

    @Enumerated(EnumType.STRING)
    @Column(name = "moneda", length = 30)
    private TipoMoneda moneda;

    @Column(name = "cotizacion", length = 50)
    private String cotizacion;
}
