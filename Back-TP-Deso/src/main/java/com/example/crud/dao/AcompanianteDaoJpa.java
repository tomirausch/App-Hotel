package com.example.crud.dao;

import com.example.crud.model.Acompaniante;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AcompanianteDaoJpa implements AcompanianteDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Acompaniante save(Acompaniante a) {
        if (a.getId() == null) {
            em.persist(a);
            return a;
        }
        return em.merge(a);
    }

    @Override
    public Optional<Acompaniante> findById(Long id) {
        return Optional.ofNullable(em.find(Acompaniante.class, id));
    }

    @Override
    public List<Acompaniante> findAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return em.createQuery("SELECT a FROM Acompaniante a WHERE a.id IN :ids", Acompaniante.class)
                .setParameter("ids", ids)
                .getResultList();
    }
}