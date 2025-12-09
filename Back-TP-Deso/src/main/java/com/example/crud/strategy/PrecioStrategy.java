package com.example.crud.strategy;

import com.example.crud.model.Habitacion;
import java.math.BigDecimal;
import java.time.LocalDate;

public interface PrecioStrategy {
    BigDecimal calcularPrecio(Habitacion habitacion, LocalDate fechaDesde, LocalDate fechaHasta);
}
