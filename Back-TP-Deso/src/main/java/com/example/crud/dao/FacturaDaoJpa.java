package com.example.crud.dao;

import com.example.crud.modelFacturacion.Factura;
import com.example.crud.model.Estadia;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class FacturaDaoJpa implements FacturaDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Factura save(Factura factura) {
        // TODO: Implementar
        return null;
    }

    @Override
    public void delete(String numero) {
        // TODO: Implementar
    }

    @Override
    public Factura modificar(Factura factura) {
        // TODO: Implementar
        return null;
    }

    @Override
    public Optional<Factura> findByNumero(String numero) {
        // TODO: Implementar
        return Optional.empty();
    }

    @Override
    public List<Factura> listarPorEstadia(Estadia estadia) {
        // TODO: Implementar
        return null;
    }
}
