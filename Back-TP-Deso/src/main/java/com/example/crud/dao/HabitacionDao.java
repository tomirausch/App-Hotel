package com.example.crud.dao;

import com.example.crud.model.Habitacion;

import java.util.List;
import java.util.Optional;

public interface HabitacionDao {

    List<Habitacion> findAllOrdenadas();

    Optional<Habitacion> findById(Long id);

    Habitacion save(Habitacion h);

    List<Habitacion> findAllById(List<Long> ids);
}
