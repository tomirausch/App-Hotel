package com.example.crud.dao;

import com.example.crud.model.Estadia;
import java.util.Optional;

public interface EstadiaDao {
    Estadia save(Estadia e);
    Optional<Estadia> findById(Long id);
}