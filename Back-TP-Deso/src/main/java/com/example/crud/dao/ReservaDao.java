package com.example.crud.dao;

import com.example.crud.model.Reserva;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservaDao {

    Reserva save(Reserva r);

    Optional<Reserva> findById(Long id);

    /**
     * Todas las reservas (no canceladas) que se solapan
     * con el rango [desde, hasta] para cualquier habitación.
     */
    List<Reserva> buscarReservasEntre(LocalDate desde, LocalDate hasta);

    /**
     * Todas las reservas (no canceladas) que se solapan
     * con el rango [desde, hasta] para una habitación concreta.
     */
    List<Reserva> buscarPorHabitacionEntre(Long idHabitacion,
                                           LocalDate desde,
                                           LocalDate hasta);

    List<Reserva> buscarConfirmadasPorHabitacionYFecha(Long idHabitacion, LocalDate fecha);
}

