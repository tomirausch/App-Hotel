package com.example.crud.api;

import com.example.crud.dto.FacturaDTO;
import com.example.crud.service.GestorFacturacion;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/facturacion")
public class FacturacionController {

    private final GestorFacturacion service;

    public FacturacionController(GestorFacturacion service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<FacturaDTO> crearFactura(@Valid @RequestBody FacturaDTO request) {
        FacturaDTO creada = service.crearFactura(request);
        return ResponseEntity
                .created(URI.create("/api/facturacion/" + creada.getId()))
                .body(creada);
    }

}
