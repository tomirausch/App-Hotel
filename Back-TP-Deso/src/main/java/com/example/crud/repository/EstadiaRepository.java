package com.example.crud.repository;

import com.example.crud.model.Estadia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT e FROM Estadia e JOIN e.habitacion h WHERE h.id = :habitacionId AND "
            +
            "((e.fechaDesde <= :fechaHasta AND e.fechaHasta >= :fechaDesde))")
    java.util.List<Estadia> findConflictingEstadias(
            @org.springframework.data.repository.query.Param("habitacionId") Long habitacionId,
            @org.springframework.data.repository.query.Param("fechaDesde") java.time.LocalDate fechaDesde,
            @org.springframework.data.repository.query.Param("fechaHasta") java.time.LocalDate fechaHasta);

    @org.springframework.data.jpa.repository.Query("SELECT e FROM Estadia e WHERE " +
            "((e.fechaDesde <= :fechaHasta AND e.fechaHasta >= :fechaDesde))")
    java.util.List<Estadia> findAllInDateRange(
            @org.springframework.data.repository.query.Param("fechaDesde") java.time.LocalDate fechaDesde,
            @org.springframework.data.repository.query.Param("fechaHasta") java.time.LocalDate fechaHasta);
}
