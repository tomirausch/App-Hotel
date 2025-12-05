package com.example.crud.factory;

import com.example.crud.dto.MetodoPagoDTO;
import com.example.crud.enums.MarcaTarjeta;
import com.example.crud.enums.TipoCheque;
import com.example.crud.enums.TipoMoneda;
import com.example.crud.enums.TipoTarjeta;
import com.example.crud.modelFacturacion.Cheque;
import com.example.crud.modelFacturacion.Efectivo;
import com.example.crud.modelFacturacion.MetodoPago;
import com.example.crud.modelFacturacion.Tarjeta;

public class MetodoPagoFactory {

    public static MetodoPago crearMetodoPago(MetodoPagoDTO dto) {
        if (dto == null || dto.getTipoMetodo() == null) {
            throw new IllegalArgumentException("El DTO de método de pago o el tipo no pueden ser nulos");
        }

        switch (dto.getTipoMetodo().toUpperCase()) {
            case "EFECTIVO":
                Efectivo efectivo = new Efectivo();
                if (dto.getMoneda() != null) {
                    efectivo.setMoneda(TipoMoneda.valueOf(dto.getMoneda()));
                }
                efectivo.setCotizacion(dto.getCotizacion());
                return efectivo;

            case "TARJETA":
                Tarjeta tarjeta = new Tarjeta();
                if (dto.getTipoTarjeta() != null) {
                    tarjeta.setTipo(TipoTarjeta.valueOf(dto.getTipoTarjeta()));
                }
                if (dto.getMarcaTarjeta() != null) {
                    tarjeta.setMarca(MarcaTarjeta.valueOf(dto.getMarcaTarjeta()));
                }
                tarjeta.setNumero(dto.getNumeroTarjeta());
                return tarjeta;

            case "CHEQUE":
                Cheque cheque = new Cheque();
                cheque.setNumero(dto.getNumeroCheque());
                if (dto.getTipoCheque() != null) {
                    cheque.setTipo(TipoCheque.valueOf(dto.getTipoCheque()));
                }
                cheque.setPlaza(dto.getPlaza());
                cheque.setFechaCobro(dto.getFechaCobro());
                cheque.setBanco(dto.getBanco());
                return cheque;

            default:
                throw new IllegalArgumentException("Tipo de método de pago no soportado: " + dto.getTipoMetodo());
        }
    }
}
