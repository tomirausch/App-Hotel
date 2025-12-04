package com.example.crud.repository;

import com.example.crud.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("""
            SELECT DISTINCT r
            FROM Reserva r
            JOIN FETCH r.reservaHabitaciones rh
            WHERE rh.estado IN ('PENDIENTE', 'CONFIRMADA')
              AND rh.fecha BETWEEN :desde AND :hasta
            """)
    List<Reserva> buscarReservasEntre(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);

    @Query("""
            SELECT DISTINCT r
            FROM Reserva r
            JOIN r.reservaHabitaciones rh
            WHERE rh.habitacion.id = :idHabitacion
              AND rh.estado IN ('PENDIENTE', 'CONFIRMADA')
              AND rh.fecha BETWEEN :desde AND :hasta
            """)
    List<Reserva> buscarPorHabitacionEntre(@Param("idHabitacion") Long idHabitacion,
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta);

    @Query("""
            SELECT DISTINCT r
            FROM Reserva r
            JOIN r.reservaHabitaciones rh
            WHERE rh.habitacion.id = :idHab
              AND rh.estado IN ('PENDIENTE', 'CONFIRMADA')
              AND rh.fecha = :fecha
            """)
    List<Reserva> buscarConfirmadasPorHabitacionYFecha(@Param("idHab") Long idHabitacion,
            @Param("fecha") LocalDate fecha);
}
