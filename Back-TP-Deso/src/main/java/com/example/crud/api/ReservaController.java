package com.example.crud.api;

import com.example.crud.dto.ReservaDTO;
import com.example.crud.model.Reserva;
import com.example.crud.service.GestorHabitaciones;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/reservas")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ReservaController {

    private final GestorHabitaciones gestorHabitaciones;

    @PostMapping
    public ResponseEntity<?> crearReserva(@Valid @RequestBody ReservaDTO request) {
        Reserva nuevaReserva = gestorHabitaciones.confirmarReserva(request);

        return ResponseEntity
                .created(URI.create("/api/reservas/" + nuevaReserva.getId()))
                .body("Reserva confirmada con éxito. ID: " + nuevaReserva.getId());
    }
}
