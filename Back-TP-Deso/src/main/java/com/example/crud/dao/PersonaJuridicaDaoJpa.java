package com.example.crud.dao;

import com.example.crud.modelFacturacion.PersonaJuridica;
import com.example.crud.repository.PersonaJuridicaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PersonaJuridicaDaoJpa implements PersonaJuridicaDao {

    private final PersonaJuridicaRepository repository;

    @Override
    public PersonaJuridica save(PersonaJuridica persona) {
        return repository.save(persona);
    }

    @Override
    public Optional<PersonaJuridica> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Optional<PersonaJuridica> buscarPorCuit(String cuit) {
        return repository.findByCuit(cuit);
    }
}
