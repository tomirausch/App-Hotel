package com.example.crud.dao;

import com.example.crud.modelFacturacion.NotaCredito;
import com.example.crud.modelFacturacion.Factura;
import java.util.List;

public interface NotaCreditoDao {
    NotaCredito save(NotaCredito notaCredito);

    void delete(Long id);

    NotaCredito modificar(NotaCredito notaCredito);

    List<NotaCredito> listarPorFactura(Factura factura);
}
