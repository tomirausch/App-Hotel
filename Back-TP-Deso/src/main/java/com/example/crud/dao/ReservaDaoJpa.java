package com.example.crud.dao;

import com.example.crud.model.Reserva;
import com.example.crud.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ReservaDaoJpa implements ReservaDao {

  private final ReservaRepository repository;

  @Override
  public Reserva save(Reserva r) {
    return repository.save(r);
  }

  @Override
  public java.util.List<Reserva> saveAll(java.util.List<Reserva> reservas) {
    return repository.saveAll(reservas);
  }

  @Override
  public java.util.List<Reserva> findConflictingReservations(Long habitacionId, java.time.LocalDate fechaDesde,
      java.time.LocalDate fechaHasta) {
    return repository.findConflictingReservations(habitacionId, fechaDesde, fechaHasta);
  }

  @Override
  public java.util.List<Reserva> findAllInDateRange(java.time.LocalDate fechaDesde, java.time.LocalDate fechaHasta) {
    return repository.findAllInDateRange(fechaDesde, fechaHasta);
  }

  @Override
  public Optional<Reserva> findById(Long id) {
    return repository.findById(id);
  }

  @Override
  public java.util.List<Reserva> findPendingByGuestName(String nombre, String apellido) {
    return repository.findPendingByGuestName(nombre, apellido);
  }

  @Override
  public java.util.List<Reserva> findAllById(List<Long> ids) {
    return repository.findAllById(ids);
  }
}
