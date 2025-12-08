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
import com.example.crud.repository.FacturaRepository;
import com.example.crud.repository.EstadiaRepository;
import com.example.crud.dao.HuespedDao;
import com.example.crud.repository.PersonaJuridicaRepository;
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

    private final FacturaRepository facturaRepository;
    private final EstadiaRepository estadiaRepository;
    private final HuespedDao huespedDao;
    private final PersonaJuridicaRepository personaJuridicaRepository;

    @Transactional
    public FacturaDTO crearFactura(FacturaDTO dto) {
        Factura factura = FacturaMapper.toEntity(dto);

        if (dto.getIdEstadia() != null) {
            Estadia estadia = estadiaRepository.findById(dto.getIdEstadia())
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
            PersonaJuridica pj = personaJuridicaRepository.findById(dto.getIdPersonaJuridica())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "Persona Jurídica no encontrada: " + dto.getIdPersonaJuridica()));
            factura.setPersonaJuridica(pj);
        }

        return FacturaMapper.toDTO(facturaRepository.save(factura));
    }

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
