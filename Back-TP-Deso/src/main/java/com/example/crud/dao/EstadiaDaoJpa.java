package com.example.crud.dao;

import com.example.crud.model.Estadia;
import com.example.crud.repository.EstadiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EstadiaDaoJpa implements EstadiaDao {

    private final EstadiaRepository repository;

    @Override
    public Estadia save(Estadia e) {
        return repository.save(e);
    }

    @Override
    public Optional<Estadia> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Estadia> buscarEstadiasEntre(LocalDate desde, LocalDate hasta) {
        return repository.buscarEstadiasEntre(desde, hasta);
    }
}
