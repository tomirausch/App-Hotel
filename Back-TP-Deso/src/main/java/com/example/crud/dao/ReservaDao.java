package com.example.crud.dao;

import com.example.crud.model.Reserva;
import java.util.List;
import java.util.Optional;

public interface ReservaDao {

        Reserva save(Reserva r);

        List<Reserva> saveAll(List<Reserva> reservas);

        java.util.List<Reserva> findConflictingReservations(Long habitacionId, java.time.LocalDate fechaDesde,
                        java.time.LocalDate fechaHasta);

        java.util.List<Reserva> findAllInDateRange(java.time.LocalDate fechaDesde, java.time.LocalDate fechaHasta);

        Optional<Reserva> findById(Long id);

        List<Reserva> findPendingByGuestName(String nombre, String apellido);

        List<Reserva> findAllById(List<Long> ids);

}
