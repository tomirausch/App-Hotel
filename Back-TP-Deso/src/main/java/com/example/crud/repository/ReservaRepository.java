package com.example.crud.repository;

import com.example.crud.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

        @Query("SELECT r FROM Reserva r WHERE r.habitacion.id = :habitacionId AND r.estado <> 'CANCELADA' AND "
                        +
                        "((r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde))")
        java.util.List<Reserva> findConflictingReservations(
                        @Param("habitacionId") Long habitacionId,
                        @Param("fechaDesde") java.time.LocalDate fechaDesde,
                        @Param("fechaHasta") java.time.LocalDate fechaHasta);

        @Query("SELECT r FROM Reserva r WHERE r.estado <> 'CANCELADA' AND " +
                        "((r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde))")
        java.util.List<Reserva> findAllInDateRange(
                        @Param("fechaDesde") java.time.LocalDate fechaDesde,
                        @Param("fechaHasta") java.time.LocalDate fechaHasta);

        @Query("SELECT r FROM Reserva r WHERE r.estado = 'PENDIENTE' AND r.huesped.apellido LIKE %:apellido% AND (:nombre IS NULL OR r.huesped.nombre LIKE %:nombre%)")
        java.util.List<Reserva> findPendingByGuestName(
                        @Param("nombre") String nombre,
                        @Param("apellido") String apellido);
}
