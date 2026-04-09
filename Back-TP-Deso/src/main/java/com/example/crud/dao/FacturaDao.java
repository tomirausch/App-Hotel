package com.example.crud.dao;

import com.example.crud.model.Factura;
import com.example.crud.model.Estadia;
import java.util.List;

public interface FacturaDao {
    Factura save(Factura factura);

    void delete(String numero);

    Factura modificar(Factura factura);

    List<Factura> listarPorEstadia(Estadia estadia);
}
