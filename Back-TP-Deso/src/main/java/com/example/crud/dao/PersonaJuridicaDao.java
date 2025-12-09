package com.example.crud.dao;

import com.example.crud.modelFacturacion.PersonaJuridica;
import java.util.Optional;

public interface PersonaJuridicaDao {
    PersonaJuridica save(PersonaJuridica persona);

    Optional<PersonaJuridica> findById(Long id);

    Optional<PersonaJuridica> buscarPorCuit(String cuit);
}
