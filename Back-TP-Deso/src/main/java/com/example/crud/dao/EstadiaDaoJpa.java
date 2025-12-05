package com.example.crud.dao;

import com.example.crud.model.Estadia;
import com.example.crud.repository.EstadiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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
    public java.util.List<Estadia> findConflictingEstadias(Long habitacionId, java.time.LocalDate fechaDesde,
            java.time.LocalDate fechaHasta) {
        return repository.findConflictingEstadias(habitacionId, fechaDesde, fechaHasta);
    }

    @Override
    public java.util.List<Estadia> findAllInDateRange(java.time.LocalDate fechaDesde, java.time.LocalDate fechaHasta) {
        return repository.findAllInDateRange(fechaDesde, fechaHasta);
    }

    @Override
    public Optional<Estadia> findById(Long id) {
        return repository.findById(id);
    }
}
