package com.example.crud.dao;

import com.example.crud.model.Acompaniante;
import com.example.crud.enums.TipoDocumento;
import com.example.crud.repository.AcompanianteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AcompanianteDaoJpa implements AcompanianteDao {

    private final AcompanianteRepository repository;

    @Override
    public Acompaniante save(Acompaniante a) {
        return repository.save(a);
    }

    @Override
    public List<Acompaniante> findAllById(java.util.List<Long> ids) {
        return repository.findAllById(ids);
    }

    @Override
    public void delete(Acompaniante a) {
        repository.delete(a);
    }

    @Override
    public Optional<Acompaniante> findByDocumento(TipoDocumento tipo, String numero) {
        return repository.findByTipoDocumentoAndNumeroDocumento(tipo, numero);
    }

    @Override
    public Optional<Acompaniante> findById(Long id) {
        return repository.findById(id);
    }
}
