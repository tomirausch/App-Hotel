package com.example.crud.api;

import com.example.crud.dto.OcuparHabitacionRequest;
import com.example.crud.model.Estadia;
import com.example.crud.service.GestorHabitaciones;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/estadias")
public class EstadiaController {

    private final GestorHabitaciones gestorHabitaciones;

    public EstadiaController(GestorHabitaciones gestorHabitaciones) {
        this.gestorHabitaciones = gestorHabitaciones;
    }

    // ===========================================================
    // CU15 – OCUPAR HABITACIÓN
    // ===========================================================
    @PostMapping("/ocupar")
    public ResponseEntity<?> ocuparHabitacion(@Valid @RequestBody OcuparHabitacionRequest request) {
        // Llama al gestor que valida estados, cancela reservas previas y crea la estadía
        Estadia nuevaEstadia = gestorHabitaciones.confirmarOcupacion(request);

        return ResponseEntity
                .created(URI.create("/api/estadias/" + nuevaEstadia.getId()))
                .body("Check-in realizado con éxito. Estadía ID: " + nuevaEstadia.getId());
    }
}