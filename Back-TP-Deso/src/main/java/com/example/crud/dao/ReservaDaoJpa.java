package com.example.crud.dao;

import com.example.crud.model.Reserva;
import com.example.crud.model.ReservaHabitacion;
import com.example.crud.repository.ReservaHabitacionRepository;
import com.example.crud.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ReservaDaoJpa implements ReservaDao {

  private final ReservaRepository repository;
  private final ReservaHabitacionRepository reservaHabitacionRepository;

  @Override
  public Reserva save(Reserva r) {
    return repository.save(r);
  }

  @Override
  public Optional<Reserva> findById(Long id) {
    return repository.findById(id);
  }

  @Override
  public List<Reserva> buscarReservasEntre(LocalDate desde, LocalDate hasta) {
    return repository.buscarReservasEntre(desde, hasta);
  }

  @Override
  public List<Reserva> buscarPorHabitacionEntre(Long idHabitacion, LocalDate desde, LocalDate hasta) {
    return repository.buscarPorHabitacionEntre(idHabitacion, desde, hasta);
  }

  @Override
  public List<Reserva> buscarConfirmadasPorHabitacionYFecha(Long idHabitacion, LocalDate fecha) {
    return repository.buscarConfirmadasPorHabitacionYFecha(idHabitacion, fecha);
  }

  @Override
  public List<ReservaHabitacion> buscarReservaHabitacionesPorReservaYFechas(Long idReserva, List<LocalDate> fechas) {
    if (fechas == null || fechas.isEmpty()) {
      return List.of();
    }
    return reservaHabitacionRepository.buscarPorReservaYFechas(idReserva, fechas);
  }
}
