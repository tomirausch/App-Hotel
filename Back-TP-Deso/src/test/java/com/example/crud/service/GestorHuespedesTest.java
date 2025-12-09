package com.example.crud.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.example.crud.dao.HuespedDao;
import com.example.crud.dao.PersonaJuridicaDao;
import com.example.crud.dto.HuespedDTO;
import com.example.crud.dto.PersonaJuridicaDTO;
import com.example.crud.enums.TipoDocumento;
import com.example.crud.exception.DocumentoDuplicadoException;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.Huesped;
import com.example.crud.modelFacturacion.PersonaJuridica;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class GestorHuespedesTest {

    @Mock
    private HuespedDao huespedDao;

    @Mock
    private PersonaJuridicaDao personaJuridicaDao;

    @InjectMocks
    private GestorHuespedes gestorHuespedes;

    @Test
    void crear_DeberiaGuardarYRetornarHuesped() {
        HuespedDTO dto = new HuespedDTO();
        dto.setNombre("Juan");
        dto.setApellido("Perez");
        dto.setTipoDocumento(TipoDocumento.DNI);
        dto.setNumeroDocumento("12345678");

        Huesped huesped = new Huesped();
        huesped.setId(1L);
        huesped.setNombre("Juan");

        when(huespedDao.save(any(Huesped.class))).thenReturn(huesped);

        Huesped result = gestorHuespedes.crear(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(huespedDao).save(any(Huesped.class));
    }

    @Test
    void buscar_DeberiaRetornarLista() {
        HuespedDTO filtros = new HuespedDTO();
        filtros.setApellido("Perez");

        when(huespedDao.buscarPorCriterios(any(), any(), any(), any()))
                .thenReturn(Collections.singletonList(new Huesped()));

        List<Huesped> result = gestorHuespedes.buscar(filtros);

        assertFalse(result.isEmpty());
        verify(huespedDao).buscarPorCriterios(eq("Perez"), any(), any(), any());
    }

    @Test
    void eliminar_DeberiaEliminar_CuandoExiste() {
        Long id = 1L;
        Huesped huesped = new Huesped();
        huesped.setId(id);

        when(huespedDao.findById(id)).thenReturn(Optional.of(huesped));

        gestorHuespedes.eliminar(id);

        verify(huespedDao).delete(huesped);
    }

    @Test
    void eliminar_DeberiaLanzarExcepcion_CuandoNoExiste() {
        Long id = 1L;
        when(huespedDao.findById(id)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> gestorHuespedes.eliminar(id));
        verify(huespedDao, never()).delete(any());
    }

    @Test
    void actualizar_DeberiaActualizar_CuandoExiste() {
        Long id = 1L;
        HuespedDTO dto = new HuespedDTO();
        dto.setNombre("NuevoNombre");

        Huesped existente = new Huesped();
        existente.setId(id);
        existente.setNombre("ViejoNombre");

        when(huespedDao.findById(id)).thenReturn(Optional.of(existente));
        when(huespedDao.save(any(Huesped.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Huesped result = gestorHuespedes.actualizar(id, dto);

        assertEquals("NuevoNombre", result.getNombre());
        verify(huespedDao).save(existente);
    }

    @Test
    void actualizar_DeberiaLanzarExcepcion_CuandoNoExiste() {
        Long id = 1L;
        HuespedDTO dto = new HuespedDTO();
        when(huespedDao.findById(id)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> gestorHuespedes.actualizar(id, dto));
        verify(huespedDao, never()).save(any());
    }

    @Test
    void buscarPorDocumento_DeberiaRetornarOptional() {
        TipoDocumento tipo = TipoDocumento.DNI;
        String numero = "123";
        Huesped huesped = new Huesped();

        when(huespedDao.buscarPorDocumento(tipo.name(), numero)).thenReturn(Optional.of(huesped));

        Optional<Huesped> result = gestorHuespedes.buscarPorDocumento(tipo, numero);

        assertTrue(result.isPresent());
    }

    @Test
    void crearPersonaJuridica_DeberiaGuardar_CuandoNoEsDuplicado() {
        PersonaJuridicaDTO dto = new PersonaJuridicaDTO();
        dto.setCuit("20-12345678-9");
        dto.setRazonSocial("Empresa SA");

        when(personaJuridicaDao.buscarPorCuit(dto.getCuit())).thenReturn(Optional.empty());
        when(personaJuridicaDao.save(any(PersonaJuridica.class))).thenAnswer(invocation -> {
            PersonaJuridica p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });

        PersonaJuridicaDTO result = gestorHuespedes.crearPersonaJuridica(dto);

        assertNotNull(result);
        assertEquals("Empresa SA", result.getRazonSocial());
        verify(personaJuridicaDao).save(any(PersonaJuridica.class));
    }

    @Test
    void crearPersonaJuridica_DeberiaLanzarExcepcion_CuandoEsDuplicado() {
        PersonaJuridicaDTO dto = new PersonaJuridicaDTO();
        dto.setCuit("20-12345678-9");

        when(personaJuridicaDao.buscarPorCuit(dto.getCuit())).thenReturn(Optional.of(new PersonaJuridica()));

        assertThrows(DocumentoDuplicadoException.class, () -> gestorHuespedes.crearPersonaJuridica(dto));
        verify(personaJuridicaDao, never()).save(any());
    }

    @Test
    void buscarPersonaJuridicaPorCuit_DeberiaRetornarDTO_CuandoExiste() {
        String cuit = "20-12345678-9";
        PersonaJuridica pj = new PersonaJuridica();
        pj.setCuit(cuit);
        pj.setRazonSocial("Empresa");

        when(personaJuridicaDao.buscarPorCuit(cuit)).thenReturn(Optional.of(pj));

        PersonaJuridicaDTO result = gestorHuespedes.buscarPersonaJuridicaPorCuit(cuit);

        assertNotNull(result);
        assertEquals(cuit, result.getCuit());
    }

    @Test
    void buscarPersonaJuridicaPorCuit_DeberiaLanzarExcepcion_CuandoNoExiste() {
        String cuit = "999";
        when(personaJuridicaDao.buscarPorCuit(cuit)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> gestorHuespedes.buscarPersonaJuridicaPorCuit(cuit));
    }
}
