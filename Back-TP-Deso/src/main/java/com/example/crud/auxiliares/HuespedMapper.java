package com.example.crud.auxiliares;

import com.example.crud.dto.HuespedRequest;
import com.example.crud.dto.HuespedResponse;
import com.example.crud.model.Huesped;

public final class HuespedMapper {

    private HuespedMapper() {}

    // ============================
    // 1) DTO de entrada -> Entidad
    // ============================
    public static Huesped toEntity(HuespedRequest dto) {
        if (dto == null) return null;

        Huesped h = new Huesped();

        // Datos propios de Huesped
        h.setNombre(dto.getNombre());
        h.setApellido(dto.getApellido());
        h.setTipoDocumento(dto.getTipoDocumento());
        h.setNumeroDocumento(dto.getNumeroDocumento());
        h.setFechaNacimiento(dto.getFechaNacimiento());
        h.setOcupacion(dto.getOcupacion());
        h.setCodigoPostal(dto.getCodigoPostal());
        h.setLocalidad(dto.getLocalidad());
        h.setProvincia(dto.getProvincia());
        h.setPais(dto.getPais());
        h.setEmail(dto.getEmail());
        h.setNacionalidad(dto.getNacionalidad());
        h.setPosicionIVA(dto.getPosicionIVA());

        // Datos heredados de Persona
        h.setCuit(dto.getCuit());
        h.setTelefono(dto.getTelefono());
        h.setCalle(dto.getCalle());
        h.setNumero(dto.getNumero());
        h.setDepartamento(dto.getDepartamento());
        h.setPiso(dto.getPiso());

        return h;
    }

    // ============================
    // 2) Entidad -> DTO de salida
    // ============================
    public static HuespedResponse toResponse(Huesped h) {
        if (h == null) return null;

        HuespedResponse dto = new HuespedResponse();

        dto.setId(h.getId());

        // Datos propios
        dto.setNombre(h.getNombre());
        dto.setApellido(h.getApellido());
        dto.setTipoDocumento(h.getTipoDocumento());
        dto.setNumeroDocumento(h.getNumeroDocumento());
        dto.setFechaNacimiento(h.getFechaNacimiento());
        dto.setOcupacion(h.getOcupacion());
        dto.setCodigoPostal(h.getCodigoPostal());
        dto.setLocalidad(h.getLocalidad());
        dto.setProvincia(h.getProvincia());
        dto.setPais(h.getPais());
        dto.setEmail(h.getEmail());
        dto.setNacionalidad(h.getNacionalidad());
        dto.setPosicionIVA(h.getPosicionIVA());

        // Datos heredados de Persona
        dto.setCuit(h.getCuit());
        dto.setTelefono(h.getTelefono());
        dto.setCalle(h.getCalle());
        dto.setNumero(h.getNumero());
        dto.setDepartamento(h.getDepartamento());
        dto.setPiso(h.getPiso());

        return dto;
    }

    // ============================
    // 3) (Opcional) actualizar entidad existente
    // ============================
    public static void updateEntity(Huesped h, HuespedRequest dto) {
        if (h == null || dto == null) return;

        h.setNombre(dto.getNombre());
        h.setApellido(dto.getApellido());
        h.setTipoDocumento(dto.getTipoDocumento());
        h.setNumeroDocumento(dto.getNumeroDocumento());
        h.setFechaNacimiento(dto.getFechaNacimiento());
        h.setOcupacion(dto.getOcupacion());
        h.setCodigoPostal(dto.getCodigoPostal());
        h.setLocalidad(dto.getLocalidad());
        h.setProvincia(dto.getProvincia());
        h.setPais(dto.getPais());
        h.setEmail(dto.getEmail());
        h.setNacionalidad(dto.getNacionalidad());
        h.setPosicionIVA(dto.getPosicionIVA());

        h.setCuit(dto.getCuit());
        h.setTelefono(dto.getTelefono());
        h.setCalle(dto.getCalle());
        h.setNumero(dto.getNumero());
        h.setDepartamento(dto.getDepartamento());
        h.setPiso(dto.getPiso());
    }
}
