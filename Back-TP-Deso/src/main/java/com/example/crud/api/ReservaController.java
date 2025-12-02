package com.example.crud.api;

import com.example.crud.dto.ReservaDTO;
import com.example.crud.model.Reserva;
import com.example.crud.service.GestorHabitaciones;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final GestorHabitaciones gestorHabitaciones;

    public ReservaController(GestorHabitaciones gestorHabitaciones) {
        this.gestorHabitaciones = gestorHabitaciones;
    }

    @PostMapping
    public ResponseEntity<?> crearReserva(@Valid @RequestBody ReservaDTO request) {
        Reserva nuevaReserva = gestorHabitaciones.confirmarReserva(request);

        return ResponseEntity
                .created(URI.create("/api/reservas/" + nuevaReserva.getId()))
                .body("Reserva confirmada con éxito. ID: " + nuevaReserva.getId());
    }
}
