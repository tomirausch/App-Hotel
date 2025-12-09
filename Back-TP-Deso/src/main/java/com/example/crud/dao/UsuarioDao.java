package com.example.crud.dao;

import com.example.crud.model.Usuario;
import java.util.Optional;

public interface UsuarioDao {
    Usuario save(Usuario usuario);

    void delete(String nombre);

    Usuario modificar(Usuario usuario);

    Optional<Usuario> buscarPorNombre(String nombre);
}
