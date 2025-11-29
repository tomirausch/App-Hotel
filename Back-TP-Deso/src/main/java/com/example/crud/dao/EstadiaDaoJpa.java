package com.example.crud.dao;

import com.example.crud.model.Estadia;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
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

    @Override
    public List<Estadia> buscarEstadiasEntre(LocalDate desde, LocalDate hasta) {
        String jpql = "SELECT DISTINCT e FROM Estadia e " +
                "JOIN FETCH e.estadiaHabitaciones eh " +
                "WHERE eh.fecha >= :desde AND eh.fecha <= :hasta";
        return em.createQuery(jpql, Estadia.class)
                .setParameter("desde", desde)
                .setParameter("hasta", hasta)
                .getResultList();
    }
}
