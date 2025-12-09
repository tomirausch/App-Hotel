package com.example.crud.service;

import com.example.crud.modelFacturacion.Factura;
import com.example.crud.modelFacturacion.Cheque;
import com.example.crud.modelFacturacion.Pago;
import com.example.crud.enums.TipoDocumento;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import com.example.crud.dao.FacturaDao;
import com.example.crud.dao.EstadiaDao;
import com.example.crud.dao.HuespedDao;
import com.example.crud.dao.PersonaJuridicaDao;
import jakarta.transaction.Transactional;
import com.example.crud.dto.FacturaDTO;
import com.example.crud.auxiliares.FacturaMapper;
import com.example.crud.model.Estadia;
import com.example.crud.model.Huesped;
import com.example.crud.modelFacturacion.PersonaJuridica;
import com.example.crud.exception.RecursoNoEncontradoException;

@Service
@RequiredArgsConstructor
public class GestorFacturacion {

    private final FacturaDao facturaDao;
    private final EstadiaDao estadiaDao;
    private final HuespedDao huespedDao;
    private final PersonaJuridicaDao personaJuridicaDao;

    @Transactional
    public FacturaDTO crearFactura(FacturaDTO dto) {
        Factura factura = FacturaMapper.toEntity(dto);

        if (dto.getIdEstadia() != null) {
            Estadia estadia = estadiaDao.findById(dto.getIdEstadia())
                    .orElseThrow(
                            () -> new RecursoNoEncontradoException("Estadía no encontrada: " + dto.getIdEstadia()));
            factura.setEstadia(estadia);
        }

        if (dto.getIdHuesped() != null) {
            Huesped huesped = huespedDao.findById(dto.getIdHuesped())
                    .orElseThrow(
                            () -> new RecursoNoEncontradoException("Huésped no encontrado: " + dto.getIdHuesped()));
            factura.setHuesped(huesped);
        } else if (dto.getIdPersonaJuridica() != null) {
            PersonaJuridica pj = personaJuridicaDao.findById(dto.getIdPersonaJuridica())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "Persona Jurídica no encontrada: " + dto.getIdPersonaJuridica()));
            factura.setPersonaJuridica(pj);
        }

        return FacturaMapper.toDTO(facturaDao.save(factura));
    }

    public Factura facturar(Integer nroHabitacion, LocalTime horaSalida, String responsablePago) {
        return null;
    }

    public void ingresarPago(Integer numeroHabitacion, Float importe, String cotizacion,
            String nroCheque, String plaza, LocalDate fechaCobro) {
    }

    public List<Cheque> listarCheques(LocalDate fechaDesde, LocalDate fechaHasta) {
        return null;
    }

    public List<Pago> listarIngresos(LocalDate fechaDesde, LocalDate fechaHasta) {
        return null;
    }

    public void ingresarNotaCredito(String cuit, TipoDocumento tipo, String documento) {
    }
}
