package com.example.crud.strategy;

import com.example.crud.model.Habitacion;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component("estrategiaPrecioCorporativo")
public class EstrategiaPrecioCorporativo implements PrecioStrategy {

    private static final BigDecimal DESCUENTO_CORPORATIVO = BigDecimal.valueOf(0.90);

    @Override
    public BigDecimal calcularPrecio(Habitacion habitacion, LocalDate fechaDesde, LocalDate fechaHasta) {
        if (habitacion.getTipoHabitacion() == null) {
            return BigDecimal.ZERO;
        }

        long dias = ChronoUnit.DAYS.between(fechaDesde, fechaHasta);
        if (dias < 1) {
            dias = 1;
        }

        BigDecimal precioBase = habitacion.getTipoHabitacion().getCosto().multiply(BigDecimal.valueOf(dias));
        return precioBase.multiply(DESCUENTO_CORPORATIVO);
    }
}
