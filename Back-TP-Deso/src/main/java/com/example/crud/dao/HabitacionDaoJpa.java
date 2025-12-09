package com.example.crud.dao;

import com.example.crud.model.Habitacion;
import com.example.crud.repository.HabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HabitacionDaoJpa implements HabitacionDao {

    private final HabitacionRepository repository;

    @Override
    public List<Habitacion> listarTodasOrdenadas() {
        return repository.findAllByOrderByNumeroAsc();
    }

    @Override
    public Optional<Habitacion> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Habitacion save(Habitacion h) {
        return repository.save(h);
    }

    @Override
    public List<Habitacion> findAllById(List<Long> ids) {
        return repository.findAllById(ids);
    }
}
