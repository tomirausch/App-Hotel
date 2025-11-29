package com.example.crud.service;

import com.example.crud.dao.HuespedDao;
import com.example.crud.dto.HuespedDTO;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.Huesped;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GestorHuespedes {

    private final HuespedDao dao;

    public GestorHuespedes(HuespedDao dao) {
        this.dao = dao;
    }

    @Transactional
    public Huesped crear(HuespedDTO datos) {
        Huesped nuevo = com.example.crud.auxiliares.HuespedMapper.toEntity(datos);
        return dao.save(nuevo);
    }

    public List<Huesped> buscar(HuespedDTO filtros) {
        return dao.buscarPorCriterios(
                filtros.getApellido(), filtros.getNombre(),
                filtros.getTipoDocumento(), filtros.getNumeroDocumento());
    }

    @Transactional
    public void eliminar(Long id) {
        var opt = dao.findById(id);
        if (opt.isEmpty())
            throw new RecursoNoEncontradoException("No se encontró el huésped con id=" + id);
        dao.delete(opt.get());
    }

    @Transactional
    public Huesped actualizar(Long id, HuespedDTO datos) {
        Huesped existente = dao.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró el huésped con id=" + id));
        com.example.crud.auxiliares.HuespedMapper.updateEntity(existente, datos);
        return dao.save(existente);
    }
}