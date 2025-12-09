package com.example.crud.dao;

import com.example.crud.model.Usuario;
import com.example.crud.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UsuarioDaoJpa implements UsuarioDao {

    private final UsuarioRepository repository;

    @Override
    public Usuario save(Usuario usuario) {
        return repository.save(usuario);
    }

    @Override
    public void delete(String nombre) {
        repository.findByNombre(nombre).ifPresent(repository::delete);
    }

    @Override
    public Usuario modificar(Usuario usuario) {
        return repository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorNombre(String nombre) {
        return repository.findByNombre(nombre);
    }
}
