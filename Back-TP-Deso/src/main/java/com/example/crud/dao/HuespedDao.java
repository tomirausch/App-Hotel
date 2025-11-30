package com.example.crud.dao;

import com.example.crud.model.Huesped;

import java.util.List;
import java.util.Optional;
import com.example.crud.model.TipoDocumento;

public interface HuespedDao {
    Huesped save(Huesped h);

    Optional<Huesped> findByDocumento(String tipo, String numero);

    List<Huesped> buscarPorCriterios(String apellido,
            String nombre,
            TipoDocumento tipoDocumento,
            String numeroDocumento);

    Optional<Huesped> findById(Long id);

    void delete(Huesped h);
}
