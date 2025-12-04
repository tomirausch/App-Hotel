package com.example.crud.repository;

import com.example.crud.model.ReservaHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaHabitacionRepository extends JpaRepository<ReservaHabitacion, Long> {

    @Query("""
            SELECT rh
            FROM ReservaHabitacion rh
            WHERE rh.reserva.id = :idReserva
              AND rh.fecha IN :fechas
            """)
    List<ReservaHabitacion> buscarPorReservaYFechas(@Param("idReserva") Long idReserva,
            @Param("fechas") List<LocalDate> fechas);
}
