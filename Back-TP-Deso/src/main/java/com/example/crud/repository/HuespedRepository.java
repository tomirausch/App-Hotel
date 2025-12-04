package com.example.crud.repository;

import com.example.crud.model.Huesped;
import com.example.crud.enums.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HuespedRepository extends JpaRepository<Huesped, Long>, JpaSpecificationExecutor<Huesped> {
    Optional<Huesped> findByTipoDocumentoAndNumeroDocumento(TipoDocumento tipoDocumento, String numeroDocumento);
}
