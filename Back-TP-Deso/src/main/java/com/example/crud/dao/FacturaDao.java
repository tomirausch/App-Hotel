package com.example.crud.dao;

import com.example.crud.modelFacturacion.Factura;
import com.example.crud.model.Estadia;
import java.util.List;
import java.util.Optional;

public interface FacturaDao {
    Factura save(Factura factura);

    void delete(String numero);

    Factura modificar(Factura factura);

    Optional<Factura> findByNumero(String numero);

    List<Factura> listarPorEstadia(Estadia estadia);
}
