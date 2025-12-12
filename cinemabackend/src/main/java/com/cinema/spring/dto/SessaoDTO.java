package com.cinema.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessaoDTO {
    private Long id;
    private LocalDateTime horario;
    private Long filme;
    private Long sala;
}

