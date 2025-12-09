package com.example.crud.dao;

import com.example.crud.model.Huesped;

import java.util.List;
import java.util.Optional;
import com.example.crud.enums.TipoDocumento;

public interface HuespedDao {
    Huesped save(Huesped h);

    Optional<Huesped> buscarPorDocumento(String tipo, String numero);

    List<Huesped> buscarPorCriterios(String apellido,
            String nombre,
            TipoDocumento tipoDocumento,
            String numeroDocumento);

    Optional<Huesped> findById(Long id);

    void delete(Huesped h);

    List<Huesped> findAllById(List<Long> ids);
}
