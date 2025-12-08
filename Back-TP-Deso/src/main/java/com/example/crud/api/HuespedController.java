package com.example.crud.api;

import com.example.crud.auxiliares.HuespedMapper;
import com.example.crud.dto.HuespedDTO;
import com.example.crud.dto.PersonaJuridicaDTO;
import com.example.crud.model.Huesped;
import com.example.crud.enums.TipoDocumento;
import com.example.crud.service.GestorHuespedes;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/huespedes")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HuespedController {

    private final GestorHuespedes service;

    // ===========================================================
    // CU09 – Alta de huésped
    // ===========================================================
    @PostMapping
    public ResponseEntity<HuespedDTO> crear(@Valid @RequestBody HuespedDTO request) {
        // Delegamos la lógica de 'Upsert' y mapeo al servicio
        Huesped creado = service.crear(request);

        HuespedDTO response = HuespedMapper.toDTO(creado);

        return ResponseEntity
                .created(URI.create("/api/huespedes/" + creado.getId()))
                .body(response);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<HuespedDTO>> buscar(
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String tipoDocumento,
            @RequestParam(required = false) String numeroDocumento) {
        HuespedDTO filtros = new HuespedDTO();
        filtros.setApellido(apellido);
        filtros.setNombre(nombre);
        if (tipoDocumento != null && !tipoDocumento.isBlank()) {
            filtros.setTipoDocumento(TipoDocumento.valueOf(tipoDocumento.trim().toUpperCase()));
        }
        filtros.setNumeroDocumento(numeroDocumento);

        var lista = service.buscar(filtros);
        List<HuespedDTO> result = lista.stream().map(HuespedMapper::toDTO).toList();
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HuespedDTO> actualizar(@PathVariable Long id,
            @Valid @RequestBody HuespedDTO request) {
        Huesped actualizado = service.actualizar(id, request);
        HuespedDTO response = HuespedMapper.toDTO(actualizado);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/persona-juridica")
    public ResponseEntity<PersonaJuridicaDTO> crearPersonaJuridica(@Valid @RequestBody PersonaJuridicaDTO request) {
        PersonaJuridicaDTO creado = service.crearPersonaJuridica(request);
        return ResponseEntity
                .created(URI.create("/api/huespedes/persona-juridica/" + creado.getId()))
                .body(creado);
    }

    @GetMapping("/persona-juridica/buscar")
    public ResponseEntity<PersonaJuridicaDTO> buscarPersonaJuridicaPorCuit(@RequestParam String cuit) {
        PersonaJuridicaDTO encontrado = service.buscarPersonaJuridicaPorCuit(cuit);
        return ResponseEntity.ok(encontrado);
    }
}
