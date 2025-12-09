package com.example.crud.dao;

import com.example.crud.model.Reserva;
import com.example.crud.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ReservaDaoJpa implements ReservaDao {

  private final ReservaRepository repository;

  @Override
  public Reserva save(Reserva r) {
    return repository.save(r);
  }

  @Override
  public List<Reserva> saveAll(List<Reserva> reservas) {
    return repository.saveAll(reservas);
  }

  @Override
  public List<Reserva> buscarReservasConflictivas(Long habitacionId, LocalDate fechaDesde,
      LocalDate fechaHasta) {
    return repository.buscarReservasConflictivas(habitacionId, fechaDesde, fechaHasta);
  }

  @Override
  public List<Reserva> buscarEnRangoFecha(LocalDate fechaDesde, LocalDate fechaHasta) {
    return repository.buscarEnRangoFecha(fechaDesde, fechaHasta);
  }

  @Override
  public Optional<Reserva> findById(Long id) {
    return repository.findById(id);
  }

  @Override
  public List<Reserva> buscarPendientesPorNombreHuesped(String nombre, String apellido) {
    return repository.buscarPendientesPorNombreHuesped(nombre, apellido);
  }

  @Override
  public List<Reserva> findAllById(List<Long> ids) {
    return repository.findAllById(ids);
  }
}
