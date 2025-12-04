package com.example.crud.modelFacturacion;

import com.example.crud.enums.TipoCheque;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "cheques")
@PrimaryKeyJoinColumn(name = "id_metodo_pago")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}
