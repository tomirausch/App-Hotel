package com.example.crud.repository;

import com.example.crud.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

        @Query("SELECT r FROM Reserva r WHERE r.habitacion.id = :habitacionId AND r.estado <> 'CANCELADA' AND "
                        +
                        "((r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde))")
        List<Reserva> buscarReservasConflictivas(
                        @Param("habitacionId") Long habitacionId,
                        @Param("fechaDesde") LocalDate fechaDesde,
                        @Param("fechaHasta") LocalDate fechaHasta);

        @Query("SELECT r FROM Reserva r WHERE r.estado <> 'CANCELADA' AND " +
                        "((r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde))")
        List<Reserva> buscarEnRangoFecha(
                        @Param("fechaDesde") LocalDate fechaDesde,
                        @Param("fechaHasta") LocalDate fechaHasta);

        @Query("SELECT r FROM Reserva r WHERE r.estado = 'PENDIENTE' AND r.huesped.apellido LIKE %:apellido% AND (:nombre IS NULL OR r.huesped.nombre LIKE %:nombre%)")
        List<Reserva> buscarPendientesPorNombreHuesped(
                        @Param("nombre") String nombre,
                        @Param("apellido") String apellido);
}
