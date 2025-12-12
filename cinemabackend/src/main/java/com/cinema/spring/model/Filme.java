package com.cinema.spring.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "filmes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, length = 1000)
    private String sinopse;

    @Column(nullable = false)
    private String classificacao;

    @Column(nullable = false)
    private Integer duracao;

    @Column(nullable = false)
    private String elenco;

    @Column(nullable = false)
    private String genero;

    @Column(nullable = false)
    private LocalDate dataInicioExibicao;

    @Column(nullable = false)
    private LocalDate dataFinalExibicao;
}

