package com.example.crud.api;

import com.example.crud.dto.EstadiaDTO;
import com.example.crud.dto.EstadiaDetalleDTO;
import com.example.crud.model.Estadia;
import com.example.crud.service.GestorHabitaciones;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/estadias")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EstadiaController {

    private final GestorHabitaciones gestorHabitaciones;

    @PostMapping("/ocupar")
    public ResponseEntity<?> ocuparHabitacion(@Valid @RequestBody EstadiaDTO request) {
        Estadia estadia = gestorHabitaciones.ocuparHabitacion(request);
        return ResponseEntity
                .created(URI.create("/api/estadias/" + estadia.getId()))
                .body("Estadía creada con éxito. ID: " + estadia.getId());
    }

    @GetMapping("/detalles")
    public ResponseEntity<EstadiaDetalleDTO> obtenerDetallesEstadia(@RequestParam Integer numeroHabitacion) {
        EstadiaDetalleDTO detalle = gestorHabitaciones.obtenerDetallesEstadia(numeroHabitacion);
        return ResponseEntity.ok(detalle);
    }
}
