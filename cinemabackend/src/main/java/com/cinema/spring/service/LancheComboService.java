package com.cinema.spring.service;

import com.cinema.spring.model.LancheCombo;
import com.cinema.spring.model.Pedido;
import com.cinema.spring.repository.LancheComboRepository;
import com.cinema.spring.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LancheComboService {
    private final LancheComboRepository lancheComboRepository;
    private final PedidoRepository pedidoRepository;

    public List<LancheCombo> findAll() {
        return lancheComboRepository.findAll();
    }

    public Optional<LancheCombo> findById(Long id) {
        return lancheComboRepository.findById(id);
    }

    public LancheCombo save(LancheCombo lancheCombo) {
        return lancheComboRepository.save(lancheCombo);
    }

    public LancheCombo update(Long id, LancheCombo lancheCombo) {
        lancheCombo.setId(id);
        return lancheComboRepository.save(lancheCombo);
    }

    @Transactional
    public void deleteById(Long id) {
        List<Pedido> pedidos = pedidoRepository.findAll();
        long pedidosCount = pedidos.stream()
                .filter(pedido -> pedido.getLancheCombos().stream()
                        .anyMatch(lc -> lc.getId().equals(id)))
                .count();
        
        if (pedidosCount > 0) {
            throw new RuntimeException("Não é possível excluir o lanche combo pois existem " + pedidosCount + " pedido(s) associado(s) a ele.");
        }
        
        lancheComboRepository.deleteById(id);
    }
}

