package com.example.crud.dao;

import com.example.crud.model.Acompaniante;
import com.example.crud.enums.TipoDocumento;
import java.util.List;
import java.util.Optional;

public interface AcompanianteDao {
    Acompaniante save(Acompaniante a);

    Optional<Acompaniante> findById(Long id);

    List<Acompaniante> findAllById(List<Long> ids);

    Optional<Acompaniante> findByDocumento(TipoDocumento tipoDoc, String numeroDoc);
}
