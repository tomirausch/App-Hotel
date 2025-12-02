package com.example.crud.service;

import com.example.crud.modelFacturacion.Factura;
import com.example.crud.modelFacturacion.Cheque;
import com.example.crud.modelFacturacion.Pago;
import com.example.crud.enums.TipoDocumento;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class GestorFacturacion {

    // Métodos sin implementar - solo estructura para el diagrama de clases

    public Factura facturar(Integer nroHabitacion, LocalTime horaSalida, String responsablePago) {
        // TODO: Implementar
        return null;
    }

    public void ingresarPago(Integer numeroHabitacion, Float importe, String cotizacion,
            String nroCheque, String plaza, LocalDate fechaCobro) {
        // TODO: Implementar
    }

    public List<Cheque> listarCheques(LocalDate fechaDesde, LocalDate fechaHasta) {
        // TODO: Implementar
        return null;
    }

    public List<Pago> listarIngresos(LocalDate fechaDesde, LocalDate fechaHasta) {
        // TODO: Implementar
        return null;
    }

    public void ingresarNotaCredito(String cuit, TipoDocumento tipo, String documento) {
        // TODO: Implementar
    }
}
