package com.example.crud.repository;

import com.example.crud.model.Estadia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {

        @Query("SELECT e FROM Estadia e JOIN e.habitacion h WHERE h.id = :habitacionId AND "
                        +
                        "((e.fechaDesde <= :fechaHasta AND e.fechaHasta >= :fechaDesde))")
        List<Estadia> buscarEstadiasConflictivas(
                        @Param("habitacionId") Long habitacionId,
                        @Param("fechaDesde") LocalDate fechaDesde,
                        @Param("fechaHasta") LocalDate fechaHasta);

        @Query("SELECT e FROM Estadia e WHERE " +
                        "((e.fechaDesde <= :fechaHasta AND e.fechaHasta >= :fechaDesde))")
        List<Estadia> buscarEnRangoFecha(
                        @Param("fechaDesde") LocalDate fechaDesde,
                        @Param("fechaHasta") LocalDate fechaHasta);

        @Query("SELECT e FROM Estadia e JOIN e.habitacion h WHERE h.numero = :numeroHabitacion AND e.estado = 'ACTIVA'")
        Optional<Estadia> buscarActivaPorNumeroHabitacion(
                        @Param("numeroHabitacion") Integer numeroHabitacion);
}
