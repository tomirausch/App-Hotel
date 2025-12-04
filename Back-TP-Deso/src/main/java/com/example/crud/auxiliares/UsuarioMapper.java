package com.example.crud.auxiliares;

import com.example.crud.dto.UsuarioDTO;
import com.example.crud.model.Usuario;

public final class UsuarioMapper {

    private UsuarioMapper() {
    }

    public static Usuario toEntity(UsuarioDTO dto) {
        if (dto == null)
            return null;

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setContrasena(dto.getContrasena());
        usuario.setEmail(dto.getEmail());
        return usuario;
    }

    public static UsuarioDTO toDTO(Usuario usuario) {
        if (usuario == null)
            return null;

        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .contrasena(usuario.getContrasena())
                .email(usuario.getEmail())
                .build();
    }
}
