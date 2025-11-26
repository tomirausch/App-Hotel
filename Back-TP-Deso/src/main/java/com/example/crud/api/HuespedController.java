package com.example.crud.api;

import com.example.crud.auxiliares.HuespedMapper;
import com.example.crud.dto.BuscarHuespedRequest;
import com.example.crud.dto.HuespedRequest;
import com.example.crud.dto.HuespedResponse;
import com.example.crud.model.Huesped;
import com.example.crud.model.TipoDocumento;
import com.example.crud.service.GestorHuespedes;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/huespedes")
public class HuespedController {

    private final GestorHuespedes service;

    public HuespedController(GestorHuespedes service) {
        this.service = service;
    }

    // ===========================================================
    // CU09 – Alta de huésped (Upsert por documento)
    // ===========================================================
    @PostMapping
    public ResponseEntity<HuespedResponse> crear(@Valid @RequestBody HuespedRequest request) {
        // Delegamos la lógica de 'Upsert' y mapeo al servicio
        Huesped creado = service.crear(request);

        HuespedResponse response = HuespedMapper.toResponse(creado);

        return ResponseEntity
                .created(URI.create("/api/huespedes/" + creado.getId()))
                .body(response);
    }

    @GetMapping("/existe-documento")
    public ResponseEntity<Boolean> existeDocumento(
            @RequestParam("tipoDocumento") String tipoDocumento,
            @RequestParam("numeroDocumento") String numeroDocumento
    ) {
        TipoDocumento tipo = TipoDocumento.valueOf(tipoDocumento.trim().toUpperCase());
        boolean existe = service.existeDocumento(tipo, numeroDocumento);
        return ResponseEntity.ok(existe);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<HuespedResponse>> buscar(
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String tipoDocumento,
            @RequestParam(required = false) String numeroDocumento
    ) {
        BuscarHuespedRequest filtros = new BuscarHuespedRequest();
        filtros.setApellido(apellido);
        filtros.setNombre(nombre);
        if (tipoDocumento != null && !tipoDocumento.isBlank()) {
            filtros.setTipoDocumento(TipoDocumento.valueOf(tipoDocumento.trim().toUpperCase()));
        }
        filtros.setNumeroDocumento(numeroDocumento);

        var lista = service.buscar(filtros);
        List<HuespedResponse> result = lista.stream().map(HuespedMapper::toResponse).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HuespedResponse> obtenerPorId(@PathVariable Long id) {
        Huesped entidad = service.obtenerPorId(id);
        HuespedResponse response = HuespedMapper.toResponse(entidad);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HuespedResponse> actualizar(@PathVariable Long id, @Valid @RequestBody HuespedRequest request) {
        Huesped actualizado = service.actualizar(id, request);
        HuespedResponse response = HuespedMapper.toResponse(actualizado);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}