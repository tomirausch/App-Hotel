package com.example.crud.repository;

import com.example.crud.model.Estadia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {

    @Query("""
            SELECT DISTINCT e
            FROM Estadia e
            JOIN FETCH e.estadiaHabitaciones eh
            WHERE eh.fecha BETWEEN :desde AND :hasta
            """)
    List<Estadia> buscarEstadiasEntre(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);
}
