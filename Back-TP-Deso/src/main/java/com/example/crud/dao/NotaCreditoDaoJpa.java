package com.example.crud.dao;

import com.example.crud.modelFacturacion.NotaCredito;
import com.example.crud.modelFacturacion.Factura;
import com.example.crud.repository.NotaCreditoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NotaCreditoDaoJpa implements NotaCreditoDao {

    private final NotaCreditoRepository repository;

    @Override
    public NotaCredito save(NotaCredito notaCredito) {
        return repository.save(notaCredito);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public NotaCredito modificar(NotaCredito notaCredito) {
        return repository.save(notaCredito);
    }

    @Override
    public List<NotaCredito> listarPorFactura(Factura factura) {
        return repository.findByFactura(factura);
    }
}
