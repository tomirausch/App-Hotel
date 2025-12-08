package com.example.crud.auxiliares;

import com.example.crud.dto.HuespedDTO;
import com.example.crud.model.Huesped;

public final class HuespedMapper {

    private HuespedMapper() {
    }

    // ============================
    // 1) DTO de entrada -> Entidad
    // ============================
    public static Huesped toEntity(HuespedDTO dto) {
        if (dto == null)
            return null;

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
    public static HuespedDTO toDTO(Huesped h) {
        if (h == null)
            return null;

        return HuespedDTO.builder()
                .id(h.getId())
                .nombre(h.getNombre())
                .apellido(h.getApellido())
                .tipoDocumento(h.getTipoDocumento())
                .numeroDocumento(h.getNumeroDocumento())
                .fechaNacimiento(h.getFechaNacimiento())
                .ocupacion(h.getOcupacion())
                .codigoPostal(h.getCodigoPostal())
                .localidad(h.getLocalidad())
                .provincia(h.getProvincia())
                .pais(h.getPais())
                .email(h.getEmail())
                .nacionalidad(h.getNacionalidad())
                .posicionIVA(h.getPosicionIVA())
                .cuit(h.getCuit())
                .telefono(h.getTelefono())
                .calle(h.getCalle())
                .numero(h.getNumero())
                .departamento(h.getDepartamento())
                .piso(h.getPiso())
                .build();
    }

    // ============================
    // 3) (Opcional) actualizar entidad existente
    // ============================
    public static void updateEntity(Huesped h, HuespedDTO dto) {
        if (h == null || dto == null)
            return;

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

    // ============================
    // 4) HuespedReservaDTO -> HuespedDTO
    // ============================
    public static HuespedDTO toHuespedDTO(com.example.crud.dto.HuespedReservaDTO source) {
        if (source == null)
            return null;

        return HuespedDTO.builder()
                .nombre(source.getNombre())
                .apellido(source.getApellido())
                .tipoDocumento(source.getTipoDocumento())
                .numeroDocumento(source.getNumeroDocumento())
                .telefono(source.getTelefono())
                .build();
    }

    public static HuespedDTO toHuespedDTO(Huesped h) {
        return toDTO(h);
    }
}
