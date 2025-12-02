package com.example.crud.dao;

import com.example.crud.modelFacturacion.NotaCredito;
import com.example.crud.modelFacturacion.Factura;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class NotaCreditoDaoJpa implements NotaCreditoDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public NotaCredito save(NotaCredito notaCredito) {
        // TODO: Implementar
        return null;
    }

    @Override
    public void delete(Long id) {
        // TODO: Implementar
    }

    @Override
    public NotaCredito modificar(NotaCredito notaCredito) {
        // TODO: Implementar
        return null;
    }

    @Override
    public List<NotaCredito> listarPorFactura(Factura factura) {
        // TODO: Implementar
        return null;
    }
}
