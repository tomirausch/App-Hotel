package com.example.crud.api;

import com.example.crud.dto.ReservaDTO;
import com.example.crud.model.Reserva;
import com.example.crud.dto.ReservaPendienteDTO;
import java.util.List;
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
                java.util.List<Reserva> nuevasReservas = gestorHabitaciones.confirmarReserva(request);

                java.util.List<Long> ids = nuevasReservas.stream()
                                .map(Reserva::getId)
                                .toList();

                return ResponseEntity
                                .created(URI.create("/api/reservas/" + ids.get(0)))
                                .body("Reservas confirmadas con éxito. IDs: " + ids);
        }

        @GetMapping("/pendientes")
        public ResponseEntity<List<ReservaPendienteDTO>> buscarReservasPendientes(
                        @RequestParam(required = false) String nombre,
                        @RequestParam String apellido) {
                List<ReservaPendienteDTO> reservas = gestorHabitaciones
                                .buscarReservasPendientes(nombre, apellido);
                return ResponseEntity.ok(reservas);
        }

        @PostMapping("/cancelar")
        public ResponseEntity<String> cancelarReservas(@RequestBody java.util.List<Long> ids) {
                gestorHabitaciones.cancelarReservas(ids);
                return ResponseEntity.ok("Reservas canceladas con éxito");
        }
}
