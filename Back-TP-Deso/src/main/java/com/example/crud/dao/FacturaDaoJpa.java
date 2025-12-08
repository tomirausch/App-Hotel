package com.example.crud.dao;

import com.example.crud.modelFacturacion.Factura;
import com.example.crud.model.Estadia;
import com.example.crud.repository.FacturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

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
    }

    @Override
    public Factura modificar(Factura factura) {
        return repository.save(factura);
    }

    @Override
    public List<Factura> listarPorEstadia(Estadia estadia) {
        return repository.findByEstadia(estadia);
    }
}
