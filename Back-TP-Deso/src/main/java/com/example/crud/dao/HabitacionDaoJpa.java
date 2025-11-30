package com.example.crud.dao;

import com.example.crud.model.Habitacion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class HabitacionDaoJpa implements HabitacionDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Habitacion> findAllOrdenadas() {
        return em.createQuery("""
                SELECT h FROM Habitacion h
                JOIN FETCH h.tipoHabitacion
                ORDER BY h.numero
                """, Habitacion.class)
                .getResultList();
    }

    @Override
    public Optional<Habitacion> findById(Long id) {
        Habitacion h = em.find(Habitacion.class, id);
        return Optional.ofNullable(h);
    }

    @Override
    public Habitacion save(Habitacion h) {
        if (h.getId() == null) {
            em.persist(h);
            return h;
        }
        return em.merge(h);
    }

    @Override
    public List<Habitacion> findAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return em.createQuery("""
                SELECT h FROM Habitacion h
                JOIN FETCH h.tipoHabitacion
                WHERE h.id IN :ids
                """, Habitacion.class)
                .setParameter("ids", ids)
                .getResultList();
    }
}
