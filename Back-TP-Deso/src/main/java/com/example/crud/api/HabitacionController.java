package com.example.crud.api;

import com.example.crud.service.GestorHabitaciones;
import com.example.crud.dto.HabitacionDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
public class HabitacionController {

    private final GestorHabitaciones service;

    public HabitacionController(GestorHabitaciones service) {
        this.service = service;
    }

    // ===========================================================
    // CU05 – Mostrar estado de habitaciones en un rango de fechas
    // ===========================================================
    @GetMapping("/estado")
    public ResponseEntity<List<HabitacionDTO>> estadoEnRango(
            @RequestParam("desde") String desdeStr,
            @RequestParam("hasta") String hastaStr) {
        LocalDate desde;
        LocalDate hasta;

        desde = LocalDate.parse(desdeStr);
        hasta = LocalDate.parse(hastaStr);

        var result = service.calcularEstadoDiario(desde, hasta);

        return ResponseEntity.ok(result);
    }

}
