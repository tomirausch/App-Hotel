package com.example.crud.auxiliares;

import com.example.crud.dto.PersonaJuridicaDTO;
import com.example.crud.modelFacturacion.PersonaJuridica;

public class PersonaJuridicaMapper {

    public static PersonaJuridicaDTO toDTO(PersonaJuridica entity) {
        if (entity == null)
            return null;
        return PersonaJuridicaDTO.builder()
                .id(entity.getId())
                .razonSocial(entity.getRazonSocial())
                .cuit(entity.getCuit())
                .telefono(entity.getTelefono())
                .calle(entity.getCalle())
                .numero(entity.getNumero())
                .departamento(entity.getDepartamento())
                .piso(entity.getPiso())
                .build();
    }

    public static PersonaJuridica toEntity(PersonaJuridicaDTO dto) {
        if (dto == null)
            return null;
        PersonaJuridica entity = new PersonaJuridica();
        entity.setId(dto.getId());
        entity.setRazonSocial(dto.getRazonSocial());
        entity.setCuit(dto.getCuit());
        entity.setTelefono(dto.getTelefono());
        entity.setCalle(dto.getCalle());
        entity.setNumero(dto.getNumero());
        entity.setDepartamento(dto.getDepartamento());
        entity.setPiso(dto.getPiso());
        return entity;
    }
}
