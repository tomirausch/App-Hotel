package com.example.crud.dao;

import com.example.crud.modelFacturacion.Pago;
import com.example.crud.modelFacturacion.Factura;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PagoDao {
    Pago save(Pago pago);

    void delete(Long id);

    Pago modificar(Pago pago);

    Optional<Pago> findByFactura(Factura factura);

    List<Pago> listarEntreFechas(LocalDate desde, LocalDate hasta);
}
