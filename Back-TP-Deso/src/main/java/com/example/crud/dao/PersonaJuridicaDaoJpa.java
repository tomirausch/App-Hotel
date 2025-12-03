package com.example.crud.dao;

import com.example.crud.modelFacturacion.PersonaJuridica;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class PersonaJuridicaDaoJpa implements PersonaJuridicaDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public PersonaJuridica save(PersonaJuridica personaJuridica) {
        // TODO: Implementar
        return null;
    }

    @Override
    public void delete(String cuit) {
        // TODO: Implementar
    }

    @Override
    public PersonaJuridica modificar(PersonaJuridica personaJuridica) {
        // TODO: Implementar
        return null;
    }

    @Override
    public Optional<PersonaJuridica> findByCuit(String cuit) {
        // TODO: Implementar
        return Optional.empty();
    }
}
