package com.example.crud.dao;

import com.example.crud.model.Estadia;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class EstadiaDaoJpa implements EstadiaDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Estadia save(Estadia e) {
        if (e.getId() == null) {
            em.persist(e);
            return e;
        }
        return em.merge(e);
    }

    @Override
    public Optional<Estadia> findById(Long id) {
        return Optional.ofNullable(em.find(Estadia.class, id));
    }
}
