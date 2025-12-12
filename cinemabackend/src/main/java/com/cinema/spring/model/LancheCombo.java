package com.cinema.spring.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lanche_combos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LancheCombo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(nullable = false)
    private Double valorUnitario;

    @Column(nullable = false)
    private Integer qtUnidade;

    @Column(nullable = false)
    private Double subtotal;
}

