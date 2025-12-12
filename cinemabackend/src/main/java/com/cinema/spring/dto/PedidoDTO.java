package com.cinema.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Long id;
    private LocalDateTime dataHora;
    private Integer ingressosMeiaQtd;
    private Integer ingressosInteiraQtd;
    private Long ingresso;
    private List<Long> lancheCombos;
    private Double valorTotal;
    private String metodoPagamento;
}

