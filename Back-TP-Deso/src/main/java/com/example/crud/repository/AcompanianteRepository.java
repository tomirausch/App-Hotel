package com.example.crud.repository;

import com.example.crud.model.Acompaniante;
import com.example.crud.enums.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcompanianteRepository extends JpaRepository<Acompaniante, Long> {
    Optional<Acompaniante> findByTipoDocumentoAndNumeroDocumento(TipoDocumento tipoDocumento, String numeroDocumento);
}
