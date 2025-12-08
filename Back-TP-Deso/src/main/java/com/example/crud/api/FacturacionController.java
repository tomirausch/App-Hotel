package com.example.crud.api;

import com.example.crud.dto.FacturaDTO;
// import com.example.crud.dto.PagoDTO;
// import com.example.crud.dto.NotaCreditoDTO;
import com.example.crud.service.GestorFacturacion;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
// import java.time.LocalDate;
// import java.util.List;

@RestController
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

    // TODO: Implementar endpoints según sea necesario
    // Ejemplos de endpoints que podrían agregarse:
    // - POST /api/facturacion/facturar (crear factura)
    // - POST /api/facturacion/pago (ingresar pago)
    // - GET /api/facturacion/cheques (listar cheques entre fechas)
    // - GET /api/facturacion/ingresos (listar ingresos entre fechas)
    // - POST /api/facturacion/nota-credito (ingresar nota de crédito)

}
