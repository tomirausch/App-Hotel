package com.example.crud.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.example.crud.dao.HuespedDao;
import com.example.crud.dto.FacturaDTO;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.Estadia;
import com.example.crud.model.Huesped;
import com.example.crud.model.Factura;
import com.example.crud.model.PersonaJuridica;
import com.example.crud.dao.EstadiaDao;
import com.example.crud.dao.FacturaDao;
import com.example.crud.dao.PersonaJuridicaDao;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class GestorFacturacionTest {

    @Mock
    private FacturaDao facturaDao;

    @Mock
    private EstadiaDao estadiaDao;

    @Mock
    private HuespedDao huespedDao;

    @Mock
    private PersonaJuridicaDao personaJuridicaDao;

    @InjectMocks
    private GestorFacturacion gestorFacturacion;

    @Test
    void crearFactura_ConEstadia_DeberiaVincularEstadia() {
        FacturaDTO dto = new FacturaDTO();
        dto.setIdEstadia(1L);

        Estadia estadia = new Estadia();
        estadia.setId(1L);

        when(estadiaDao.findById(1L)).thenReturn(Optional.of(estadia));
        when(facturaDao.save(any(Factura.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FacturaDTO result = gestorFacturacion.crearFactura(dto);

        assertNotNull(result);
        verify(estadiaDao).findById(1L);
        verify(facturaDao).save(any(Factura.class));
    }

    @Test
    void crearFactura_ConHuesped_DeberiaVincularHuesped() {
        FacturaDTO dto = new FacturaDTO();
        dto.setIdHuesped(1L);

        Huesped huesped = new Huesped();
        huesped.setId(1L);

        when(huespedDao.findById(1L)).thenReturn(Optional.of(huesped));
        when(facturaDao.save(any(Factura.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FacturaDTO result = gestorFacturacion.crearFactura(dto);

        assertNotNull(result);
        verify(huespedDao).findById(1L);
    }

    @Test
    void crearFactura_ConPersonaJuridica_DeberiaVincularPJ() {
        FacturaDTO dto = new FacturaDTO();
        dto.setIdPersonaJuridica(1L);

        PersonaJuridica pj = new PersonaJuridica();
        pj.setId(1L);

        when(personaJuridicaDao.findById(1L)).thenReturn(Optional.of(pj));
        when(facturaDao.save(any(Factura.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FacturaDTO result = gestorFacturacion.crearFactura(dto);

        assertNotNull(result);
        verify(personaJuridicaDao).findById(1L);
    }

    @Test
    void crearFactura_DeberiaLanzarExcepcion_CuandoEstadiaNoExiste() {
        FacturaDTO dto = new FacturaDTO();
        dto.setIdEstadia(99L);

        when(estadiaDao.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> gestorFacturacion.crearFactura(dto));
        verify(facturaDao, never()).save(any());
    }

    @Test
    void crearFactura_DeberiaLanzarExcepcion_CuandoHuespedNoExiste() {
        FacturaDTO dto = new FacturaDTO();
        dto.setIdHuesped(99L);

        when(huespedDao.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> gestorFacturacion.crearFactura(dto));
    }

    @Test
    void crearFactura_DeberiaLanzarExcepcion_CuandoPJNoExiste() {
        FacturaDTO dto = new FacturaDTO();
        dto.setIdPersonaJuridica(99L);

        when(personaJuridicaDao.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> gestorFacturacion.crearFactura(dto));
    }
}
