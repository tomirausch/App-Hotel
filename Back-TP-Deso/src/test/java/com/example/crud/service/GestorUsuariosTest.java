package com.example.crud.service;

import com.example.crud.dao.UsuarioDao;
import com.example.crud.dto.UsuarioDTO;
import com.example.crud.model.Usuario;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GestorUsuariosTest {

    @Mock
    private UsuarioDao usuarioDao;

    @InjectMocks
    private GestorUsuarios gestorUsuarios;

    @Test
    void autenticarUsuario_Exito() {
        Usuario usuario = new Usuario();
        usuario.setNombre("admin");
        usuario.setContrasena("1234");

        when(usuarioDao.buscarPorNombre("admin")).thenReturn(Optional.of(usuario));

        boolean resultado = gestorUsuarios.autenticarUsuario("admin", "1234");

        assertTrue(resultado);
    }

    @Test
    void autenticarUsuario_FalloContrasena() {
        Usuario usuario = new Usuario();
        usuario.setNombre("admin");
        usuario.setContrasena("1234");

        when(usuarioDao.buscarPorNombre("admin")).thenReturn(Optional.of(usuario));

        boolean resultado = gestorUsuarios.autenticarUsuario("admin", "wrong");

        assertFalse(resultado);
    }

    @Test
    void autenticarUsuario_UsuarioNoEncontrado() {
        when(usuarioDao.buscarPorNombre("unknown")).thenReturn(Optional.empty());

        boolean resultado = gestorUsuarios.autenticarUsuario("unknown", "1234");

        assertFalse(resultado);
    }

    @Test
    void crearUsuario() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("nuevo");
        dto.setContrasena("pass");

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("nuevo");
        usuarioGuardado.setContrasena("pass");

        when(usuarioDao.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        UsuarioDTO resultado = gestorUsuarios.crearUsuario(dto);

        assertNotNull(resultado);
        assertEquals("nuevo", resultado.getNombre());
    }

    @Test
    void modificarUsuario() {
        assertFalse(gestorUsuarios.modificarUsuario("email"));
    }

    @Test
    void darBajaUsuario() {
        assertFalse(gestorUsuarios.darBajaUsuario("email"));
    }
}
