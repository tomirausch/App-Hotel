package com.example.crud.dao;

import com.example.crud.model.Huesped;
import com.example.crud.enums.TipoDocumento;
import com.example.crud.repository.HuespedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HuespedDaoJpa implements HuespedDao {

    private final HuespedRepository repository;

    @Override
    public Huesped save(Huesped h) {
        return repository.save(h);
    }

    @Override
    public Optional<Huesped> findByDocumento(String tipo, String numero) {
        return repository.findByTipoDocumentoAndNumeroDocumento(TipoDocumento.valueOf(tipo), numero);
    }

    @Override
    public List<Huesped> buscarPorCriterios(String apellido,
            String nombre,
            TipoDocumento tipoDocumento,
            String numeroDocumento) {

        Specification<Huesped> spec = (root, query, cb) -> cb.conjunction();

        if (apellido != null && !apellido.isBlank()) {
            spec = spec.and(
                    (root, query, cb) -> cb.like(cb.upper(root.get("apellido")), apellido.trim().toUpperCase() + "%"));
        }

        if (nombre != null && !nombre.isBlank()) {
            spec = spec
                    .and((root, query, cb) -> cb.like(cb.upper(root.get("nombre")), nombre.trim().toUpperCase() + "%"));
        }

        if (tipoDocumento != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("tipoDocumento"), tipoDocumento));
        }

        if (numeroDocumento != null && !numeroDocumento.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("numeroDocumento"), numeroDocumento.trim()));
        }

        // Ordering by apellido ASC, nombre ASC
        // Note: Sort can be passed to findAll, but Specification usually handles
        // filtering.
        // We can add order to the query in the specification or pass Sort object.
        // For simplicity here, let's use Sort.

        return repository.findAll(spec, org.springframework.data.domain.Sort.by("apellido", "nombre"));
    }

    @Override
    public Optional<Huesped> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void delete(Huesped h) {
        repository.delete(h);
    }
}
