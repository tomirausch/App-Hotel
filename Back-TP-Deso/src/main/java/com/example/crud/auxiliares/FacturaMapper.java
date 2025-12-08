package com.example.crud.auxiliares;

import com.example.crud.dto.FacturaDTO;
import com.example.crud.dto.LineaFacturaDTO;
import com.example.crud.modelFacturacion.Factura;
import com.example.crud.modelFacturacion.LineaFactura;
import java.util.stream.Collectors;

public class FacturaMapper {

    public static FacturaDTO toDTO(Factura entity) {
        if (entity == null)
            return null;

        return FacturaDTO.builder()
                .id(entity.getId())
                .fechaEmision(entity.getFechaEmision())
                .horaEmision(entity.getHoraEmision())
                .iva(entity.getIva())
                .montoTotal(entity.getMontoTotal())
                .tipoMoneda(entity.getTipoMoneda())
                .tipo(entity.getTipo())
                .estado(entity.getEstado())
                .idEstadia(entity.getEstadia() != null ? entity.getEstadia().getId() : null)
                .idHuesped(entity.getHuesped() != null ? entity.getHuesped().getId() : null)
                .idPersonaJuridica(entity.getPersonaJuridica() != null ? entity.getPersonaJuridica().getId() : null)
                .lineas(entity.getLineasFactura() != null ? entity.getLineasFactura().stream()
                        .map(linea -> LineaFacturaDTO.builder()
                                .descripcion(linea.getDescripcion())
                                .precioUnitario(linea.getPrecioUnitario())
                                .cantidad(linea.getCantidad())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }

    public static Factura toEntity(FacturaDTO dto) {
        if (dto == null)
            return null;

        Factura entity = new Factura();
        entity.setFechaEmision(dto.getFechaEmision());
        entity.setHoraEmision(dto.getHoraEmision());
        entity.setIva(dto.getIva());
        entity.setMontoTotal(dto.getMontoTotal());
        entity.setTipoMoneda(dto.getTipoMoneda());
        entity.setTipo(dto.getTipo());
        entity.setEstado(com.example.crud.enums.EstadoFactura.PENDIENTE);

        if (dto.getLineas() != null) {
            entity.setLineasFactura(dto.getLineas().stream()
                    .map(lineaDTO -> {
                        LineaFactura linea = new LineaFactura();
                        linea.setDescripcion(lineaDTO.getDescripcion());
                        linea.setPrecioUnitario(lineaDTO.getPrecioUnitario());
                        linea.setCantidad(lineaDTO.getCantidad());
                        linea.setFactura(entity);
                        return linea;
                    })
                    .collect(Collectors.toList()));
        }

        // Relationships are handled by the service

        return entity;
    }
}
