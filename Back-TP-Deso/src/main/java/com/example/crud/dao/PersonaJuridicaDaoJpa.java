package com.example.crud.dao;

import com.example.crud.modelFacturacion.PersonaJuridica;
import com.example.crud.repository.PersonaJuridicaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PersonaJuridicaDaoJpa implements PersonaJuridicaDao {

    private final PersonaJuridicaRepository repository;

    @Override
    public PersonaJuridica save(PersonaJuridica personaJuridica) {
        return repository.save(personaJuridica);
    }

    @Override
    public void delete(String cuit) {
        repository.findByCuit(cuit).ifPresent(repository::delete);
    }

    @Override
    public PersonaJuridica modificar(PersonaJuridica personaJuridica) {
        return repository.save(personaJuridica);
    }

    @Override
    public Optional<PersonaJuridica> findByCuit(String cuit) {
        return repository.findByCuit(cuit);
    }
}
