package com.example.crud.dao;

import com.example.crud.model.Estadia;
import com.example.crud.repository.EstadiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.util.List;
import java.time.LocalDate;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EstadiaDaoJpa implements EstadiaDao {

    private final EstadiaRepository repository;

    @Override
    public Estadia save(Estadia e) {
        return repository.save(e);
    }

    @Override
    public List<Estadia> buscarEstadiasConflictivas(Long habitacionId, LocalDate fechaDesde,
            LocalDate fechaHasta) {
        return repository.buscarEstadiasConflictivas(habitacionId, fechaDesde, fechaHasta);
    }

    @Override
    public List<Estadia> buscarEnRangoFecha(LocalDate fechaDesde, LocalDate fechaHasta) {
        return repository.buscarEnRangoFecha(fechaDesde, fechaHasta);
    }

    @Override
    public Optional<Estadia> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Estadia> buscarActivaPorNumeroHabitacion(Integer numeroHabitacion) {
        return repository.buscarActivaPorNumeroHabitacion(numeroHabitacion);
    }
}
