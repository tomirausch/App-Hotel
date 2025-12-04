package com.example.crud.repository;

import com.example.crud.modelFacturacion.Factura;
import com.example.crud.modelFacturacion.NotaCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaCreditoRepository extends JpaRepository<NotaCredito, Long> {
    List<NotaCredito> findByFactura(Factura factura);
}
