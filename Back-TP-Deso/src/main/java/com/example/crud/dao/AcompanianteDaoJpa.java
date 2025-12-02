package com.example.crud.dao;

import com.example.crud.model.Acompaniante;
<<<<<<< HEAD
import com.example.crud.model.TipoDocumento;
=======
import com.example.crud.enums.TipoDocumento;
>>>>>>> 9750e49a63e362977753ffc33b0571e870a723c8
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AcompanianteDaoJpa implements AcompanianteDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Acompaniante save(Acompaniante a) {
        if (a.getId() == null) {
            em.persist(a);
            return a;
        }
        return em.merge(a);
    }

    @Override
    public Optional<Acompaniante> findById(Long id) {
        return Optional.ofNullable(em.find(Acompaniante.class, id));
    }

    @Override
    public List<Acompaniante> findAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return em.createQuery("SELECT a FROM Acompaniante a WHERE a.id IN :ids", Acompaniante.class)
                .setParameter("ids", ids)
                .getResultList();
    }

    @Override
    public Optional<Acompaniante> findByDocumento(TipoDocumento tipoDoc, String numeroDoc) {
        return em.createQuery(
                "SELECT a FROM Acompaniante a WHERE a.tipoDocumento = :tipoDoc AND a.numeroDocumento = :numeroDoc",
                Acompaniante.class)
                .setParameter("tipoDoc", tipoDoc)
                .setParameter("numeroDoc", numeroDoc)
                .getResultList()
                .stream()
                .findFirst();
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 9750e49a63e362977753ffc33b0571e870a723c8
