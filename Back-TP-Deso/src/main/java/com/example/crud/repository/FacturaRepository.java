package com.example.crud.repository;

import com.example.crud.model.Estadia;
import com.example.crud.modelFacturacion.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    List<Factura> findByEstadia(Estadia estadia);
}
