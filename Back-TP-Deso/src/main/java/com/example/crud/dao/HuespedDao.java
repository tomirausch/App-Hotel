package com.example.crud.dao;

import com.example.crud.model.Huesped;

import java.util.List;
import java.util.Optional;
import com.example.crud.model.TipoDocumento;

public interface HuespedDao {
    Huesped save(Huesped h);

    List<Huesped> buscarPorCriterios(String apellido,
            String nombre,
            TipoDocumento tipoDocumento,
            String numeroDocumento);

    Optional<Huesped> findById(Long id);

    void delete(Huesped h);
}
