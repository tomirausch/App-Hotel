package com.example.crud.dao;

import com.example.crud.modelFacturacion.Factura;
import com.example.crud.model.Estadia;
import com.example.crud.repository.FacturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class FacturaDaoJpa implements FacturaDao {

    private final FacturaRepository repository;

    @Override
    public Factura save(Factura factura) {
        return repository.save(factura);
    }

    @Override
    public void delete(String numero) {
        repository.findByNumero(numero).ifPresent(repository::delete);
    }

    @Override
    public Factura modificar(Factura factura) {
        return repository.save(factura);
    }

    @Override
    public Optional<Factura> findByNumero(String numero) {
        return repository.findByNumero(numero);
    }

    @Override
    public List<Factura> listarPorEstadia(Estadia estadia) {
        return repository.findByEstadia(estadia);
    }
}
