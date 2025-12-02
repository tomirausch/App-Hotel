package com.example.crud.dao;

import com.example.crud.model.Huesped;
import com.example.crud.enums.TipoDocumento;
import jakarta.persistence.*;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class HuespedDaoJpa implements HuespedDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Huesped save(Huesped h) {
        if (h.getId() == null) {
            em.persist(h);
            return h;
        }
        return em.merge(h);
    }

    @Override
    public Optional<Huesped> findByDocumento(String tipo, String numero) {
        var q = em.createQuery("""
                    SELECT h FROM Huesped h
                    WHERE h.tipoDocumento = :t AND h.numeroDocumento = :n
                """, Huesped.class);

        q.setParameter("t", TipoDocumento.valueOf(tipo));
        q.setParameter("n", numero);

        var r = q.getResultList();
        return r.isEmpty() ? Optional.empty() : Optional.of(r.get(0));
    }

    @Override
    public List<Huesped> buscarPorCriterios(String apellido,
            String nombre,
            TipoDocumento tipoDocumento,
            String numeroDocumento) {

        StringBuilder jpql = new StringBuilder("SELECT h FROM Huesped h WHERE 1=1");
        Map<String, Object> params = new HashMap<>();

        if (apellido != null && !apellido.isBlank()) {
            jpql.append(" AND UPPER(h.apellido) LIKE :apellido");
            params.put("apellido", apellido.trim().toUpperCase() + "%");
        }

        if (nombre != null && !nombre.isBlank()) {
            jpql.append(" AND UPPER(h.nombre) LIKE :nombre");
            params.put("nombre", nombre.trim().toUpperCase() + "%");
        }

        if (tipoDocumento != null) {
            jpql.append(" AND h.tipoDocumento = :tipoDocumento");
            params.put("tipoDocumento", tipoDocumento);
        }

        if (numeroDocumento != null && !numeroDocumento.isBlank()) {
            jpql.append(" AND h.numeroDocumento = :numeroDocumento");
            params.put("numeroDocumento", numeroDocumento.trim());
        }

        jpql.append(" ORDER BY h.apellido ASC, h.nombre ASC");

        var query = em.createQuery(jpql.toString(), Huesped.class);

        params.forEach(query::setParameter);

        return query.getResultList();
    }

    @Override
    public Optional<Huesped> findById(Long id) {
        Huesped h = em.find(Huesped.class, id);
        return Optional.ofNullable(h);
    }

    @Override
    public void delete(Huesped h) {
        Huesped managed = h;
        if (!em.contains(h)) {
            managed = em.merge(h);
        }
        em.remove(managed);
    }
}
