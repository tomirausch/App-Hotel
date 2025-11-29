package com.example.crud.auxiliares;

import com.example.crud.dto.EstadiaDTO;
import com.example.crud.dto.EstadiaDetalleDTO;
import com.example.crud.model.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class EstadiaMapper {

    private EstadiaMapper() {
    }

    public static Estadia toEntity(EstadiaDTO dto,
            List<Habitacion> habitaciones,
            Huesped responsable,
            List<Acompaniante> acompanantesGuardados,
            BigDecimal costoEstadia) {

        Estadia e = new Estadia();

        // Datos directos
        e.setResponsable(responsable);
        e.setAcompanantes(acompanantesGuardados);
        e.setCostoEstadia(costoEstadia);

        // Lógica simple de cálculo de personas
        int cantidad = 1; // El responsable cuenta
        if (acompanantesGuardados != null) {
            cantidad += acompanantesGuardados.size();
        }
        e.setCantPersonas(cantidad);

        // Descuento por defecto
        e.setDescuento(0.0);

        // Crear mapa de habitaciones por ID para búsqueda rápida
        Map<Long, Habitacion> habitacionMap = habitaciones.stream()
                .collect(Collectors.toMap(Habitacion::getId, h -> h));

        // Crear EstadiaHabitacion por cada detalle
        for (EstadiaDetalleDTO detalle : dto.getDetalles()) {
            Habitacion hab = habitacionMap.get(detalle.getIdHabitacion());
            if (hab == null) {
                throw new IllegalArgumentException("Habitación con ID " + detalle.getIdHabitacion() + " no encontrada");
            }
            EstadiaHabitacion eh = new EstadiaHabitacion(e, hab, detalle.getFecha());
            e.addEstadiaHabitacion(eh);
        }

        return e;
    }
}