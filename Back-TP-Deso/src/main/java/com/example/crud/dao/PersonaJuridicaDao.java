package com.example.crud.dao;

import com.example.crud.modelFacturacion.PersonaJuridica;
import java.util.Optional;

public interface PersonaJuridicaDao {
    PersonaJuridica save(PersonaJuridica personaJuridica);

    void delete(String cuit);

    PersonaJuridica modificar(PersonaJuridica personaJuridica);

    Optional<PersonaJuridica> findByCuit(String cuit);
}
