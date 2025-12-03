package com.example.crud.dao;

import com.example.crud.modelFacturacion.Pago;
import com.example.crud.modelFacturacion.Factura;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class PagoDaoJpa implements PagoDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Pago save(Pago pago) {
        // TODO: Implementar
        return null;
    }

    @Override
    public void delete(Long id) {
        // TODO: Implementar
    }

    @Override
    public Pago modificar(Pago pago) {
        // TODO: Implementar
        return null;
    }

    @Override
    public Optional<Pago> findByFactura(Factura factura) {
        // TODO: Implementar
        return Optional.empty();
    }

    @Override
    public List<Pago> listarEntreFechas(LocalDate desde, LocalDate hasta) {
        // TODO: Implementar
        return null;
    }
}
