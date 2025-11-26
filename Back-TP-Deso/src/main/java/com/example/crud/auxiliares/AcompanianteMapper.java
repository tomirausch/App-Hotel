package com.example.crud.auxiliares;

import com.example.crud.dto.DatosAcompaniante;
import com.example.crud.model.Acompaniante;

public final class AcompanianteMapper {

    private AcompanianteMapper() {}

    public static Acompaniante toEntity(DatosAcompaniante dto) {
        if (dto == null) return null;

        Acompaniante a = new Acompaniante();
        a.setNombre(dto.getNombre());
        a.setApellido(dto.getApellido());
        a.setTipoDocumento(dto.getTipoDocumento());
        a.setNumeroDocumento(dto.getNumeroDocumento());

        return a;
    }
}