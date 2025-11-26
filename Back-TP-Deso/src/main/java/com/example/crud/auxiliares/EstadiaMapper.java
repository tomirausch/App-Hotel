package com.example.crud.auxiliares;

import com.example.crud.dto.OcuparHabitacionRequest;
import com.example.crud.model.Acompaniante;
import com.example.crud.model.Estadia;
import com.example.crud.model.Habitacion;
import com.example.crud.model.Huesped;

import java.util.List;

public final class EstadiaMapper {

    private EstadiaMapper() {}

    public static Estadia toEntity(OcuparHabitacionRequest request,
                                   Habitacion habitacion,
                                   Huesped responsable,
                                   List<Acompaniante> acompanantesGuardados) {

        Estadia e = new Estadia();

        // Datos directos del request
        e.setFechaInicio(request.getFechaInicio());
        e.setFechaFin(request.getFechaFin());

        // Relaciones ya recuperadas/guardadas
        e.setHabitacion(habitacion);
        e.setResponsable(responsable);
        e.setAcompanantes(acompanantesGuardados);

        // Lógica simple de cálculo
        int cantidad = 1; // El responsable cuenta
        if (acompanantesGuardados != null) {
            cantidad += acompanantesGuardados.size();
        }
        e.setCantPersonas(cantidad);

        // Descuento por defecto (o podría venir en el request)
        e.setDescuento(0.0);

        return e;
    }
}