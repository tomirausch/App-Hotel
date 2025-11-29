package com.example.crud.dao;

import com.example.crud.model.Estadia;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EstadiaDao {
    Estadia save(Estadia e);

    Optional<Estadia> findById(Long id);

    List<Estadia> buscarEstadiasEntre(LocalDate desde, LocalDate hasta);
}