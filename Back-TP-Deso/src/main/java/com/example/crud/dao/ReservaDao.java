package com.example.crud.dao;

import com.example.crud.model.Reserva;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface ReservaDao {

        Reserva save(Reserva r);

        List<Reserva> saveAll(List<Reserva> reservas);

        List<Reserva> buscarReservasConflictivas(Long habitacionId, LocalDate fechaDesde,
                        LocalDate fechaHasta);

        List<Reserva> buscarEnRangoFecha(LocalDate fechaDesde, LocalDate fechaHasta);

        Optional<Reserva> findById(Long id);

        List<Reserva> buscarPendientesPorNombreHuesped(String nombre, String apellido);

        List<Reserva> findAllById(List<Long> ids);

}
