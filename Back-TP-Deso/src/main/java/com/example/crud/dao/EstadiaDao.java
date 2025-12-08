package com.example.crud.dao;

import com.example.crud.model.Estadia;
import java.util.Optional;

public interface EstadiaDao {
    Estadia save(Estadia e);

    java.util.List<Estadia> findConflictingEstadias(Long habitacionId, java.time.LocalDate fechaDesde,
            java.time.LocalDate fechaHasta);

    java.util.List<Estadia> findAllInDateRange(java.time.LocalDate fechaDesde, java.time.LocalDate fechaHasta);

    Optional<Estadia> findById(Long id);

    Optional<Estadia> findActiveByHabitacionNumero(Integer numeroHabitacion);
}
