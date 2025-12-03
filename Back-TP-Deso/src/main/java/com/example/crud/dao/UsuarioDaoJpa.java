package com.example.crud.dao;

import com.example.crud.model.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class UsuarioDaoJpa implements UsuarioDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Usuario save(Usuario usuario) {
        // TODO: Implementar
        return null;
    }

    @Override
    public void delete(String nombre) {
        // TODO: Implementar
    }

    @Override
    public Usuario modificar(Usuario usuario) {
        // TODO: Implementar
        return null;
    }

    @Override
    public Optional<Usuario> findByNombre(String nombre) {
        // TODO: Implementar
        return Optional.empty();
    }
}
