package com.example.crud.service;

import com.example.crud.dao.HuespedDao;
import com.example.crud.dto.AcompanianteDTO;
import com.example.crud.dto.HuespedDTO;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.dao.AcompanianteDao;
import com.example.crud.model.Acompaniante;
import com.example.crud.model.Huesped;
import com.example.crud.enums.TipoDocumento;
import com.example.crud.auxiliares.AcompanianteMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GestorHuespedes {

    private final HuespedDao dao;
    private final AcompanianteDao acompanianteDao;

    public GestorHuespedes(HuespedDao dao, AcompanianteDao acompanianteDao) {
        this.dao = dao;
        this.acompanianteDao = acompanianteDao;
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

    @Transactional
    public Optional<Huesped> buscarPorDocumento(TipoDocumento tipo, String numero) {
        if (tipo == null || numero == null)
            return Optional.empty();
        return dao.findByDocumento(tipo.name(), numero);
    }

    @Transactional
    public AcompanianteDTO darDeAltaAcompaniante(AcompanianteDTO dto) {
        Acompaniante nuevo = AcompanianteMapper.toEntity(dto);
        return AcompanianteMapper.toDTO(acompanianteDao.save(nuevo));
    }

    @Transactional
    public AcompanianteDTO buscarAcompaniante(TipoDocumento tipoDoc, String numeroDoc) {
        Acompaniante encontrado = acompanianteDao.findByDocumento(tipoDoc, numeroDoc)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró acompañante con documento: " + numeroDoc));
        return AcompanianteMapper.toDTO(encontrado);
    }
}
