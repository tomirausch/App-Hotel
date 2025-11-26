package com.example.crud.dao;

import com.example.crud.model.EstadoReserva;
import com.example.crud.model.Reserva;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class ReservaDaoJpa implements ReservaDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Reserva save(Reserva r) {
        if (r.getId() == null) {
            em.persist(r);
            return r;
        }
        return em.merge(r);
    }

    @Override
    public Optional<Reserva> findById(Long id) {
        return Optional.ofNullable(em.find(Reserva.class, id));
    }

    @Override
    public List<Reserva> buscarReservasEntre(LocalDate desde, LocalDate hasta) {
        return em.createQuery("""
                SELECT DISTINCT r
                FROM Reserva r
                JOIN FETCH r.habitaciones h
                WHERE r.estado <> :cancelada
                  AND r.fechaDesde <= :hasta
                  AND r.fechaHasta >= :desde
                """, Reserva.class)
                .setParameter("cancelada", EstadoReserva.CANCELADA)
                .setParameter("desde", desde)
                .setParameter("hasta", hasta)
                .getResultList();
    }

    @Override
    public List<Reserva> buscarPorHabitacionEntre(Long idHabitacion, LocalDate desde, LocalDate hasta) {
        return em.createQuery("""
                SELECT DISTINCT r
                FROM Reserva r
                JOIN r.habitaciones h
                WHERE h.id = :idHabitacion
                  AND r.estado <> :cancelada
                  AND r.fechaDesde <= :hasta
                  AND r.fechaHasta >= :desde
                """, Reserva.class)
                .setParameter("idHabitacion", idHabitacion)
                .setParameter("cancelada", EstadoReserva.CANCELADA)
                .setParameter("desde", desde)
                .setParameter("hasta", hasta)
                .getResultList();
    }

    @Override
    public List<Reserva> buscarConfirmadasPorHabitacionYFecha(Long idHabitacion, LocalDate fecha) {
        return em.createQuery("""
                SELECT DISTINCT r
                FROM Reserva r
                JOIN r.habitaciones h
                WHERE h.id = :idHab
                  AND r.estado = :estado
                  AND :fecha >= r.fechaDesde 
                  AND :fecha <= r.fechaHasta
                """, Reserva.class)
                .setParameter("idHab", idHabitacion)
                .setParameter("estado", EstadoReserva.CONFIRMADA)
                .setParameter("fecha", fecha)
                .getResultList();
    }
}