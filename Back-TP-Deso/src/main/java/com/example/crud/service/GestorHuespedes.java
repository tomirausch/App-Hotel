package com.example.crud.service;

import com.example.crud.dao.HuespedDao;
import com.example.crud.dto.BuscarHuespedRequest;
import com.example.crud.dto.HuespedRequest;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.Huesped;
import com.example.crud.model.TipoDocumento;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GestorHuespedes {

    private final HuespedDao dao;

    public GestorHuespedes(HuespedDao dao) {
        this.dao = dao;
    }

    public boolean existeDocumento(TipoDocumento tipo, String numeroDocumento) {
        if (tipo == null || numeroDocumento == null) return false;
        return dao.findByDocumento(tipo.name(), numeroDocumento.trim()).isPresent();
    }

    public Optional<Huesped> buscarPorDocumento(TipoDocumento tipo, String numero) {
        if (tipo == null || numero == null) return Optional.empty();
        return dao.findByDocumento(tipo.name(), numero);
    }

    /**
     * MÉTODO 1: Usado por el CONTROLLER (CU09).
     * Recibe el DTO, busca por documento.
     * - Si existe: actualiza los datos usando el Mapper.
     * - Si no existe: crea nuevo usando el Mapper.
     */
    @Transactional
    public Huesped crear(HuespedRequest datos) {
        if (datos == null) throw new IllegalArgumentException("Los datos no pueden ser nulos");

        TipoDocumento tipo = datos.getTipoDocumento();
        String numero = datos.getNumeroDocumento();

        // Upsert logic
        if (tipo != null && numero != null) {
            Optional<Huesped> existenteOpt = dao.findByDocumento(tipo.name(), numero);

            if (existenteOpt.isPresent()) {
                Huesped existente = existenteOpt.get();
                // Actualizamos la entidad gestionada con los datos nuevos
                com.example.crud.auxiliares.HuespedMapper.updateEntity(existente, datos);
                return dao.save(existente);
            }
        }

        // Si no existe, creamos de cero
        Huesped nuevo = com.example.crud.auxiliares.HuespedMapper.toEntity(datos);
        return dao.save(nuevo);
    }

    /**
     * MÉTODO 2: Usado por GESTOR HABITACIONES (CU04).
     * Recibe una Entidad ya armada (parcialmente).
     * Mantiene la lógica de verificar si existe para reutilizar ID.
     */
    @Transactional
    public Huesped crear(Huesped huespedEntrante) {
        Optional<Huesped> existente = dao.findByDocumento(
                huespedEntrante.getTipoDocumento().name(),
                huespedEntrante.getNumeroDocumento()
        );

        if (existente.isPresent()) {
            // Si existe, usamos su ID para que el save haga un merge/update
            huespedEntrante.setId(existente.get().getId());
        }
        return dao.save(huespedEntrante);
    }

    public List<Huesped> buscar(BuscarHuespedRequest filtros) {
        return dao.buscarPorCriterios(
                filtros.getApellido(), filtros.getNombre(),
                filtros.getTipoDocumento(), filtros.getNumeroDocumento()
        );
    }

    @Transactional
    public void eliminar(Long id) {
        var opt = dao.findById(id);
        if (opt.isEmpty()) throw new RecursoNoEncontradoException("No se encontró el huésped con id=" + id);
        dao.delete(opt.get());
    }

    public Huesped obtenerPorId(Long id) {
        return dao.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("No se encontró el huésped con id=" + id));
    }

    @Transactional
    public Huesped actualizar(Long id, HuespedRequest datos) {
        Huesped existente = dao.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("No se encontró el huésped con id=" + id));
        com.example.crud.auxiliares.HuespedMapper.updateEntity(existente, datos);
        return dao.save(existente);
    }
}