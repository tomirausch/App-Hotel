package com.example.crud.dao;

import com.example.crud.model.Reserva;
import com.example.crud.model.ReservaHabitacion;
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
        JOIN FETCH r.reservaHabitaciones rh
        WHERE rh.estado IN ('PENDIENTE', 'CONFIRMADA')
          AND rh.fecha BETWEEN :desde AND :hasta
        """, Reserva.class)
        .setParameter("desde", desde)
        .setParameter("hasta", hasta)
        .getResultList();
  }

  @Override
  public List<Reserva> buscarPorHabitacionEntre(Long idHabitacion, LocalDate desde, LocalDate hasta) {
    return em.createQuery("""
        SELECT DISTINCT r
        FROM Reserva r
        JOIN r.reservaHabitaciones rh
        WHERE rh.habitacion.id = :idHabitacion
          AND rh.estado IN ('PENDIENTE', 'CONFIRMADA')
          AND rh.fecha BETWEEN :desde AND :hasta
        """, Reserva.class)
        .setParameter("idHabitacion", idHabitacion)
        .setParameter("desde", desde)
        .setParameter("hasta", hasta)
        .getResultList();
  }

  @Override
  public List<Reserva> buscarConfirmadasPorHabitacionYFecha(Long idHabitacion, LocalDate fecha) {
    return em.createQuery("""
        SELECT DISTINCT r
        FROM Reserva r
        JOIN r.reservaHabitaciones rh
        WHERE rh.habitacion.id = :idHab
          AND rh.estado IN ('PENDIENTE', 'CONFIRMADA')
          AND rh.fecha = :fecha
        """, Reserva.class)
        .setParameter("idHab", idHabitacion)
        .setParameter("fecha", fecha)
        .getResultList();
  }

  @Override
  public List<ReservaHabitacion> buscarReservaHabitacionesPorReservaYFechas(Long idReserva, List<LocalDate> fechas) {
    if (fechas == null || fechas.isEmpty()) {
      return List.of();
    }
    return em.createQuery("""
        SELECT rh
        FROM ReservaHabitacion rh
        WHERE rh.reserva.id = :idReserva
          AND rh.fecha IN :fechas
        """, ReservaHabitacion.class)
        .setParameter("idReserva", idReserva)
        .setParameter("fechas", fechas)
        .getResultList();
  }
}
