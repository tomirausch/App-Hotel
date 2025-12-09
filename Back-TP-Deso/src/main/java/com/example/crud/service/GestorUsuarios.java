package com.example.crud.service;

import com.example.crud.auxiliares.UsuarioMapper;
import com.example.crud.dao.UsuarioDao;
import com.example.crud.dto.UsuarioDTO;
import com.example.crud.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class GestorUsuarios {

    private final UsuarioDao usuarioDao;

    public boolean autenticarUsuario(String nombre, String contrasena) {
        return usuarioDao.buscarPorNombre(nombre)
                .map(u -> u.getContrasena().equals(contrasena))
                .orElse(false);
    }

    @Transactional
    public UsuarioDTO crearUsuario(UsuarioDTO dto) {
        Usuario usuario = UsuarioMapper.toEntity(dto);
        Usuario guardado = usuarioDao.save(usuario);
        return UsuarioMapper.toDTO(guardado);
    }

    public boolean modificarUsuario(String email) {
        return false;
    }

    public boolean darBajaUsuario(String email) {
        return false;
    }
}
