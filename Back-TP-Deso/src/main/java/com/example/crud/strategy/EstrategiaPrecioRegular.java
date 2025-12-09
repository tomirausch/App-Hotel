package com.example.crud.strategy;

import com.example.crud.model.Habitacion;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component("estrategiaPrecioRegular")
@Primary
public class EstrategiaPrecioRegular implements PrecioStrategy {

    @Override
    public BigDecimal calcularPrecio(Habitacion habitacion, LocalDate fechaDesde, LocalDate fechaHasta) {
        if (habitacion.getTipoHabitacion() == null) {
            return BigDecimal.ZERO;
        }

        long dias = ChronoUnit.DAYS.between(fechaDesde, fechaHasta);
        if (dias < 1) {
            dias = 1;
        }

        return habitacion.getTipoHabitacion().getCosto().multiply(BigDecimal.valueOf(dias));
    }
}
