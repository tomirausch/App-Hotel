package com.example.crud.api;

import com.example.crud.auxiliares.HabitacionMapper;
import com.example.crud.dto.HabitacionResponse;
import com.example.crud.service.GestorHabitaciones;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.crud.auxiliares.HabitacionEstadoMapper;
import com.example.crud.dto.HabitacionEstadoRangoResponse;
import com.example.crud.model.EstadoHabitacion;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;


import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/habitaciones")
public class HabitacionController {

    private final GestorHabitaciones service;

    public HabitacionController(GestorHabitaciones service) {
        this.service = service;
    }

    // ===========================================================
    // Listar todas las habitaciones (base CU05)
    // ===========================================================
    @GetMapping
    public ResponseEntity<List<HabitacionResponse>> listarTodas() {
        var lista = service.listarTodas();

        List<HabitacionResponse> result = lista.stream()
                .map(HabitacionMapper::toResponse)
                .toList();

        return ResponseEntity.ok(result);
    }

    // ===========================================================
    // CU05 – Mostrar estado de habitaciones en un rango de fechas
    // ===========================================================
    @GetMapping("/estado")
    public ResponseEntity<List<HabitacionEstadoRangoResponse>> estadoEnRango(
            @RequestParam("desde") String desdeStr,
            @RequestParam("hasta") String hastaStr
    ) {
        LocalDate desde;
        LocalDate hasta;

        try {
            desde = LocalDate.parse(desdeStr); // formato esperado: YYYY-MM-DD
            hasta = LocalDate.parse(hastaStr);
        } catch (DateTimeParseException e) {
            // Podríamos tirar una excepción custom para que la maneje ApiErrorHandler,
            // pero para ir rápido devolvemos 400 directo.
            return ResponseEntity.badRequest().build();
        }

        if (hasta.isBefore(desde)) {
            return ResponseEntity.badRequest().build();
        }

        var habitaciones = service.listarTodas();
        var estadosMapa = service.calcularEstadoEnRango(desde, hasta);

        List<HabitacionEstadoRangoResponse> result = habitaciones.stream()
                .map(h -> {
                    EstadoHabitacion estado = estadosMapa.getOrDefault(
                            h.getId(),
                            EstadoHabitacion.DISPONIBLE
                    );
                    return HabitacionEstadoMapper.toResponse(h, estado);
                })
                .toList();

        return ResponseEntity.ok(result);
    }

}
