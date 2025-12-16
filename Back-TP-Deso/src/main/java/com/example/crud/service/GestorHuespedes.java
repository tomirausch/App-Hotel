package com.example.crud.service;

import com.example.crud.dao.HuespedDao;
import com.example.crud.dto.HuespedDTO;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.Huesped;
import com.example.crud.enums.TipoDocumento;
import com.example.crud.auxiliares.HuespedMapper;
import com.example.crud.dto.PersonaJuridicaDTO;
import com.example.crud.model.PersonaJuridica;
import com.example.crud.auxiliares.PersonaJuridicaMapper;
import com.example.crud.exception.DocumentoDuplicadoException;
import com.example.crud.dao.PersonaJuridicaDao;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class GestorHuespedes {

    private final HuespedDao dao;
    private final PersonaJuridicaDao personaJuridicaDao;

    @Transactional
    public Huesped crear(HuespedDTO datos) {
        Huesped nuevo = HuespedMapper.toEntity(datos);
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
        HuespedMapper.updateEntity(existente, datos);
        return dao.save(existente);
    }

    @Transactional
    public Optional<Huesped> buscarPorDocumento(TipoDocumento tipo, String numero) {
        if (tipo == null || numero == null)
            return Optional.empty();
        return dao.buscarPorDocumento(tipo.name(), numero);
    }

    @Transactional
    public PersonaJuridicaDTO crearPersonaJuridica(PersonaJuridicaDTO dto) {
        if (personaJuridicaDao.buscarPorCuit(dto.getCuit()).isPresent()) {
            throw new DocumentoDuplicadoException("Ya existe una persona jurídica con CUIT " + dto.getCuit());
        }
        PersonaJuridica nueva = PersonaJuridicaMapper.toEntity(dto);
        return PersonaJuridicaMapper.toDTO(personaJuridicaDao.save(nueva));
    }

    @Transactional
    public PersonaJuridicaDTO buscarPersonaJuridicaPorCuit(String cuit) {
        PersonaJuridica encontrado = personaJuridicaDao.buscarPorCuit(cuit)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró persona jurídica con CUIT: " + cuit));
        return PersonaJuridicaMapper.toDTO(encontrado);
    }

    @Transactional
    public void eliminarPersonaJuridica(Long id) {
        if (personaJuridicaDao.findById(id).isEmpty()) {
            throw new RecursoNoEncontradoException("No se encontró la persona jurídica con id=" + id);
        }
        personaJuridicaDao.deleteById(id);
    }

    @Transactional
    public PersonaJuridicaDTO modificarPersonaJuridica(Long id, PersonaJuridicaDTO dto) {
        PersonaJuridica existente = personaJuridicaDao.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró la persona jurídica con id=" + id));

        PersonaJuridicaMapper.updateEntity(existente, dto);
        return PersonaJuridicaMapper.toDTO(personaJuridicaDao.save(existente));
    }
}