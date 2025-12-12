package com.cinema.spring.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private Integer ingressosMeiaQtd;

    @Column(nullable = false)
    private Integer ingressosInteiraQtd;

    @ManyToOne
    @JoinColumn(name = "ingresso_id", nullable = false)
    private Ingresso ingresso;

    @ManyToMany
    @JoinTable(
        name = "pedido_lanche_combo",
        joinColumns = @JoinColumn(name = "pedido_id"),
        inverseJoinColumns = @JoinColumn(name = "lanche_combo_id")
    )
    private List<LancheCombo> lancheCombos = new java.util.ArrayList<>();

    @Column(nullable = false)
    private Double valorTotal;

    @Column(nullable = false)
    private String metodoPagamento;
}

