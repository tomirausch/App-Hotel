package com.example.crud.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadiaDetalleDTO {
    private Long idEstadia;
    private BigDecimal costoBaseEstadia;
    private List<HuespedDTO> ocupantes;
    private List<ServicioDTO> serviciosConsumidos;
}
