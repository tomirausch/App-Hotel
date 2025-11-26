package com.example.crud.dao;

import com.example.crud.model.Acompaniante;
import java.util.Optional;

public interface AcompanianteDao {
    Acompaniante save(Acompaniante a);
    Optional<Acompaniante> findById(Long id);
}