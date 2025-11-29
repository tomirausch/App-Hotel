package com.example.crud.auxiliares;

import com.example.crud.dto.AcompanianteDTO;
import com.example.crud.model.Acompaniante;

public final class AcompanianteMapper {

    private AcompanianteMapper() {
    }

    public static Acompaniante toEntity(AcompanianteDTO dto) {
        if (dto == null)
            return null;

        Acompaniante a = new Acompaniante();
        a.setNombre(dto.getNombre());
        a.setApellido(dto.getApellido());
        a.setTipoDocumento(dto.getTipoDocumento());
        a.setNumeroDocumento(dto.getNumeroDocumento());

        return a;
    }
}