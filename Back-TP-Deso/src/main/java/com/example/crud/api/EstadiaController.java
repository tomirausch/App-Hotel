package com.example.crud.api;

import com.example.crud.dto.OcuparHabitacionRequestDTO;
import com.example.crud.model.Estadia;
import com.example.crud.service.GestorHabitaciones;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/estadias")
public class EstadiaController {

    private final GestorHabitaciones gestorHabitaciones;

    public EstadiaController(GestorHabitaciones gestorHabitaciones) {
        this.gestorHabitaciones = gestorHabitaciones;
    }

    @PostMapping("/ocupar")
    public ResponseEntity<?> ocuparHabitacion(@Valid @RequestBody OcuparHabitacionRequestDTO request) {
        Estadia estadia = gestorHabitaciones.ocuparHabitacion(request);
        return ResponseEntity
                .created(URI.create("/api/estadias/" + estadia.getId()))
                .body("Estadía creada con éxito. ID: " + estadia.getId());
    }
}
