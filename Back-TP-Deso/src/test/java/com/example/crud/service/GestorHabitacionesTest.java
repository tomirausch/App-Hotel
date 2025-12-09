package com.example.crud.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

import com.example.crud.dao.EstadiaDao;
import com.example.crud.dao.HabitacionDao;
import com.example.crud.dao.HuespedDao;
import com.example.crud.dao.ReservaDao;
import com.example.crud.dto.EstadiaDTO;
import com.example.crud.dto.HabitacionDTO;
import com.example.crud.dto.ReservaDTO;
import com.example.crud.dto.ReservaDetalleDTO;
import com.example.crud.dto.HuespedReservaDTO;
import com.example.crud.enums.EstadoEstadia;
import com.example.crud.enums.EstadoHabitacion;
import com.example.crud.enums.EstadoReserva;
import com.example.crud.enums.TipoDocumento;
import com.example.crud.exception.RecursoNoEncontradoException;
import com.example.crud.model.Estadia;
import com.example.crud.model.Habitacion;
import com.example.crud.model.Huesped;
import com.example.crud.model.Reserva;
import com.example.crud.model.TipoHabitacion;
import com.example.crud.model.EstadiaServicio;
import com.example.crud.model.Servicio;
import com.example.crud.dto.EstadiaDetalleDTO;
import com.example.crud.dto.ReservaPendienteDTO;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class GestorHabitacionesTest {

    @Mock
    private HabitacionDao habitacionDao;

    @Mock
    private ReservaDao reservaDao;

    @Mock
    private EstadiaDao estadiaDao;

    @Mock
    private HuespedDao huespedDao;

    @Mock
    private com.example.crud.strategy.PrecioStrategy estrategiaPrecio;

    @InjectMocks
    private GestorHabitaciones gestorHabitaciones;

    @Test
    void listarTodas_DeberiaRetornarLista() {
        when(habitacionDao.listarTodasOrdenadas()).thenReturn(Collections.singletonList(new Habitacion()));
        List<Habitacion> result = gestorHabitaciones.listarTodas();
        assertFalse(result.isEmpty());
        verify(habitacionDao).listarTodasOrdenadas();
    }

    @Test
    void obtenerPorId_DeberiaRetornarHabitacion_CuandoExiste() {
        Long id = 1L;
        Habitacion h = new Habitacion();
        h.setId(id);
        when(habitacionDao.findById(id)).thenReturn(Optional.of(h));
        Habitacion result = gestorHabitaciones.obtenerPorId(id);
        assertEquals(id, result.getId());
    }

    @Test
    void obtenerPorId_DeberiaLanzarExcepcion_CuandoNoExiste() {
        Long id = 1L;
        when(habitacionDao.findById(id)).thenReturn(Optional.empty());
        assertThrows(RecursoNoEncontradoException.class, () -> gestorHabitaciones.obtenerPorId(id));
    }

    @Test
    void calcularEstadoDiario_DeberiaRetornarEstadosCorrectos() {
        LocalDate desde = LocalDate.now();
        LocalDate hasta = LocalDate.now();

        Habitacion h = new Habitacion();
        h.setId(1L);
        h.setTipoHabitacion(new TipoHabitacion()); // Avoid NPE in mapper if accessed

        Reserva r = new Reserva();
        r.setHabitacion(h);
        r.setFechaDesde(desde);
        r.setFechaHasta(hasta);

        when(habitacionDao.listarTodasOrdenadas()).thenReturn(Collections.singletonList(h));
        when(reservaDao.buscarEnRangoFecha(desde, hasta)).thenReturn(Collections.singletonList(r));
        when(estadiaDao.buscarEnRangoFecha(desde, hasta)).thenReturn(Collections.emptyList());

        List<HabitacionDTO> result = gestorHabitaciones.calcularEstadoDiario(desde, hasta);

        assertFalse(result.isEmpty());
        assertEquals(EstadoHabitacion.RESERVADA, result.get(0).getEstado());
    }

    @Test
    void confirmarReserva_DeberiaGuardarReservas() {
        ReservaDTO request = new ReservaDTO();
        ReservaDetalleDTO detalle = new ReservaDetalleDTO();
        detalle.setIdHabitacion(1L);
        request.setDetalles(Collections.singletonList(detalle));

        HuespedReservaDTO huespedReserva = new HuespedReservaDTO();
        huespedReserva.setTipoDocumento(TipoDocumento.DNI);
        huespedReserva.setNumeroDocumento("123");
        request.setDatosHuesped(huespedReserva);

        Habitacion h = new Habitacion();
        h.setId(1L);
        Huesped huesped = new Huesped();

        when(habitacionDao.findAllById(anyList())).thenReturn(Collections.singletonList(h));
        when(reservaDao.saveAll(anyList())).thenReturn(Collections.emptyList());

        gestorHabitaciones.confirmarReserva(request, huesped);

        verify(reservaDao).saveAll(anyList());
    }

    @Test
    void ocuparHabitacion_DeberiaCrearEstadia_YManejarReservas() {
        EstadiaDTO request = new EstadiaDTO();
        request.setIdHuespedResponsable(1L);
        request.setIdHabitacion(1L);
        request.setFechaDesde(LocalDate.now());
        request.setFechaHasta(LocalDate.now().plusDays(1));

        Huesped responsable = new Huesped();
        responsable.setId(1L);
        Habitacion habitacion = new Habitacion();
        habitacion.setId(1L);

        when(huespedDao.findById(1L)).thenReturn(Optional.of(responsable));
        when(habitacionDao.findById(1L)).thenReturn(Optional.of(habitacion));
        when(reservaDao.buscarReservasConflictivas(anyLong(), any(), any())).thenReturn(Collections.emptyList());
        when(estrategiaPrecio.calcularPrecio(any(), any(), any())).thenReturn(BigDecimal.valueOf(1000));
        when(estadiaDao.save(any(Estadia.class))).thenAnswer(i -> i.getArgument(0));

        Estadia result = gestorHabitaciones.ocuparHabitacion(request);

        assertNotNull(result);
        assertEquals(EstadoEstadia.ACTIVA, result.getEstado());
        verify(estadiaDao).save(any(Estadia.class));
    }

    @Test
    void cancelarReservas_DeberiaActualizarEstado() {
        List<Long> ids = Collections.singletonList(1L);
        Reserva r = new Reserva();
        r.setId(1L);
        r.setEstado(EstadoReserva.PENDIENTE);

        when(reservaDao.findAllById(ids)).thenReturn(Collections.singletonList(r));

        gestorHabitaciones.cancelarReservas(ids);

        assertEquals(EstadoReserva.CANCELADA, r.getEstado());
        verify(reservaDao).saveAll(anyList());
    }

    @Test
    void obtenerDetallesEstadia_DeberiaRetornarDetalles_CuandoExisteEstadia() {
        Integer numeroHabitacion = 101;
        Estadia estadia = new Estadia();
        estadia.setId(1L);
        estadia.setCostoEstadia(BigDecimal.valueOf(1000));

        Huesped responsable = new Huesped();
        responsable.setId(1L);
        responsable.setNombre("Juan");
        responsable.setApellido("Perez");
        estadia.setResponsable(responsable);

        Servicio servicio = new Servicio();
        servicio.setId(1L);
        servicio.setNombre("Cena");
        servicio.setPrecioUnidad(500.0f);

        EstadiaServicio es = new EstadiaServicio();
        es.setServicio(servicio);
        estadia.setEstadiaServicios(Collections.singletonList(es));

        when(estadiaDao.buscarActivaPorNumeroHabitacion(numeroHabitacion)).thenReturn(Optional.of(estadia));

        EstadiaDetalleDTO result = gestorHabitaciones.obtenerDetallesEstadia(numeroHabitacion);

        assertNotNull(result);
        assertEquals(estadia.getId(), result.getIdEstadia());
        assertEquals(1, result.getOcupantes().size());
        assertEquals(1, result.getServiciosConsumidos().size());
    }

    @Test
    void obtenerDetallesEstadia_DeberiaLanzarExcepcion_CuandoNoExisteEstadia() {
        Integer numeroHabitacion = 101;
        when(estadiaDao.buscarActivaPorNumeroHabitacion(numeroHabitacion)).thenReturn(Optional.empty());
        assertThrows(RecursoNoEncontradoException.class,
                () -> gestorHabitaciones.obtenerDetallesEstadia(numeroHabitacion));
    }

    @Test
    void buscarReservasPendientes_DeberiaRetornarLista() {
        String nombre = "Juan";
        String apellido = "Perez";

        Reserva r = new Reserva();
        r.setId(1L);
        Huesped h = new Huesped();
        h.setNombre(nombre);
        h.setApellido(apellido);
        r.setHuesped(h);

        Habitacion hab = new Habitacion();
        hab.setNumero(101);
        TipoHabitacion th = new TipoHabitacion();
        th.setNombre("Simple");
        hab.setTipoHabitacion(th);
        r.setHabitacion(hab);

        when(reservaDao.buscarPendientesPorNombreHuesped(nombre, apellido)).thenReturn(Collections.singletonList(r));

        List<ReservaPendienteDTO> result = gestorHabitaciones.buscarReservasPendientes(nombre, apellido);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(nombre, result.get(0).getNombreHuesped());
    }

    @Test
    void ocuparHabitacion_ConReservaConflictivaMismoHuesped_DeberiaConfirmarReserva() {
        EstadiaDTO request = new EstadiaDTO();
        request.setIdHuespedResponsable(1L);
        request.setIdHabitacion(1L);
        request.setFechaDesde(LocalDate.now());
        request.setFechaHasta(LocalDate.now().plusDays(1));

        Huesped responsable = new Huesped();
        responsable.setId(1L);
        Habitacion habitacion = new Habitacion();
        habitacion.setId(1L);

        Reserva reservaConflictiva = new Reserva();
        reservaConflictiva.setId(10L);
        reservaConflictiva.setHuesped(responsable);
        reservaConflictiva.setEstado(EstadoReserva.PENDIENTE);

        when(huespedDao.findById(1L)).thenReturn(Optional.of(responsable));
        when(habitacionDao.findById(1L)).thenReturn(Optional.of(habitacion));
        when(reservaDao.buscarReservasConflictivas(anyLong(), any(), any()))
                .thenReturn(Collections.singletonList(reservaConflictiva));
        when(estrategiaPrecio.calcularPrecio(any(), any(), any())).thenReturn(BigDecimal.valueOf(1000));
        when(estadiaDao.save(any(Estadia.class))).thenAnswer(i -> i.getArgument(0));

        gestorHabitaciones.ocuparHabitacion(request);

        assertEquals(EstadoReserva.CONFIRMADA, reservaConflictiva.getEstado());
        verify(reservaDao).save(reservaConflictiva);
    }

    @Test
    void ocuparHabitacion_ConReservaConflictivaOtroHuesped_DeberiaCancelarReserva() {
        EstadiaDTO request = new EstadiaDTO();
        request.setIdHuespedResponsable(1L);
        request.setIdHabitacion(1L);
        request.setFechaDesde(LocalDate.now());
        request.setFechaHasta(LocalDate.now().plusDays(1));

        Huesped responsable = new Huesped();
        responsable.setId(1L);

        Huesped otroHuesped = new Huesped();
        otroHuesped.setId(2L);

        Habitacion habitacion = new Habitacion();
        habitacion.setId(1L);

        Reserva reservaConflictiva = new Reserva();
        reservaConflictiva.setId(10L);
        reservaConflictiva.setHuesped(otroHuesped);
        reservaConflictiva.setEstado(EstadoReserva.PENDIENTE);

        when(huespedDao.findById(1L)).thenReturn(Optional.of(responsable));
        when(habitacionDao.findById(1L)).thenReturn(Optional.of(habitacion));
        when(reservaDao.buscarReservasConflictivas(anyLong(), any(), any()))
                .thenReturn(Collections.singletonList(reservaConflictiva));
        when(estrategiaPrecio.calcularPrecio(any(), any(), any())).thenReturn(BigDecimal.valueOf(1000));
        when(estadiaDao.save(any(Estadia.class))).thenAnswer(i -> i.getArgument(0));

        gestorHabitaciones.ocuparHabitacion(request);

        assertEquals(EstadoReserva.CANCELADA, reservaConflictiva.getEstado());
        verify(reservaDao).save(reservaConflictiva);
    }

    @Test
    void calcularEstadoDiario_ConEstadia_DeberiaRetornarOcupada() {
        LocalDate desde = LocalDate.now();
        LocalDate hasta = LocalDate.now();

        Habitacion h = new Habitacion();
        h.setId(1L);
        h.setTipoHabitacion(new TipoHabitacion());

        Estadia e = new Estadia();
        e.setHabitacion(h);
        e.setFechaDesde(desde);
        e.setFechaHasta(hasta);

        when(habitacionDao.listarTodasOrdenadas()).thenReturn(Collections.singletonList(h));
        when(reservaDao.buscarEnRangoFecha(desde, hasta)).thenReturn(Collections.emptyList());
        when(estadiaDao.buscarEnRangoFecha(desde, hasta)).thenReturn(Collections.singletonList(e));

        List<HabitacionDTO> result = gestorHabitaciones.calcularEstadoDiario(desde, hasta);

        assertFalse(result.isEmpty());
        assertEquals(EstadoHabitacion.OCUPADA, result.get(0).getEstado());
    }
}
