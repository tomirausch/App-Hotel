package com.example.crud.dao;

import com.example.crud.model.Estadia;
import java.util.Optional;

import java.util.List;
import java.time.LocalDate;

public interface EstadiaDao {
    Estadia save(Estadia e);

    List<Estadia> buscarEstadiasConflictivas(Long habitacionId, LocalDate fechaDesde,
            LocalDate fechaHasta);

    List<Estadia> buscarEnRangoFecha(LocalDate fechaDesde, LocalDate fechaHasta);

    Optional<Estadia> findById(Long id);

    Optional<Estadia> buscarActivaPorNumeroHabitacion(Integer numeroHabitacion);
}
