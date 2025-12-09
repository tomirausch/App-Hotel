package com.example.crud.service;

import com.example.crud.dto.ReservaDTO;
import com.example.crud.dto.HuespedDTO;
import com.example.crud.dto.HuespedReservaDTO;
import com.example.crud.model.Reserva;
import com.example.crud.model.Huesped;
import com.example.crud.auxiliares.HuespedMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HotelFacade {

    private final GestorHabitaciones gestorHabitaciones;
    private final GestorHuespedes gestorHuespedes;

    @Transactional
    public List<Reserva> confirmarReserva(ReservaDTO request) {
        // 1. Obtener o crear el huésped usando GestorHuespedes
        Huesped huesped = obtenerOcrearHuesped(request);

        // 2. Delegar la creación de la reserva a GestorHabitaciones, pasando el huésped
        // ya resuelto
        return gestorHabitaciones.confirmarReserva(request, huesped);
    }

    private Huesped obtenerOcrearHuesped(ReservaDTO req) {
        HuespedReservaDTO reservaHuesped = req.getDatosHuesped();
        HuespedDTO huespedDTO = HuespedMapper.toHuespedDTO(reservaHuesped);

        Optional<Huesped> encontrado = gestorHuespedes.buscarPorDocumento(huespedDTO.getTipoDocumento(),
                huespedDTO.getNumeroDocumento());

        if (encontrado.isPresent()) {
            return encontrado.get();
        }

        return gestorHuespedes.crear(huespedDTO);
    }
}
