package com.example.crud.repository;

import com.example.crud.model.PersonaJuridica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonaJuridicaRepository extends JpaRepository<PersonaJuridica, Long> {
    Optional<PersonaJuridica> findByCuit(String cuit);
}
