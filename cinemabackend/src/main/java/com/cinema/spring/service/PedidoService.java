package com.cinema.spring.service;

import com.cinema.spring.dto.PedidoDTO;
import com.cinema.spring.model.Ingresso;
import com.cinema.spring.model.LancheCombo;
import com.cinema.spring.model.Pedido;
import com.cinema.spring.repository.IngressoRepository;
import com.cinema.spring.repository.LancheComboRepository;
import com.cinema.spring.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final IngressoRepository ingressoRepository;
    private final LancheComboRepository lancheComboRepository;

    public List<PedidoDTO> findAll() {
        return pedidoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<PedidoDTO> findById(Long id) {
        return pedidoRepository.findById(id)
                .map(this::toDTO);
    }

    @Transactional
    public PedidoDTO save(PedidoDTO dto) {
        Pedido pedido = toEntity(dto);
        Pedido saved = pedidoRepository.save(pedido);
        return toDTO(saved);
    }

    @Transactional
    public Optional<PedidoDTO> update(Long id, PedidoDTO dto) {
        return pedidoRepository.findById(id)
                .map(existing -> {
                    Pedido pedido = toEntity(dto);
                    pedido.setId(id);
                    Pedido updated = pedidoRepository.save(pedido);
                    return toDTO(updated);
                });
    }

    public void deleteById(Long id) {
        pedidoRepository.deleteById(id);
    }

    private PedidoDTO toDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setDataHora(pedido.getDataHora());
        dto.setIngressosMeiaQtd(pedido.getIngressosMeiaQtd());
        dto.setIngressosInteiraQtd(pedido.getIngressosInteiraQtd());
        dto.setIngresso(pedido.getIngresso().getId());
        dto.setLancheCombos(pedido.getLancheCombos().stream()
                .map(LancheCombo::getId)
                .collect(Collectors.toList()));
        dto.setValorTotal(pedido.getValorTotal());
        dto.setMetodoPagamento(pedido.getMetodoPagamento());
        return dto;
    }

    private Pedido toEntity(PedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setId(dto.getId());
        pedido.setDataHora(dto.getDataHora());
        pedido.setIngressosMeiaQtd(dto.getIngressosMeiaQtd());
        pedido.setIngressosInteiraQtd(dto.getIngressosInteiraQtd());
        
        Ingresso ingresso = ingressoRepository.findById(dto.getIngresso())
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado com id: " + dto.getIngresso()));
        pedido.setIngresso(ingresso);
        
        List<LancheCombo> lancheCombos = dto.getLancheCombos().stream()
                .map(id -> lancheComboRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("LancheCombo não encontrado com id: " + id)))
                .collect(Collectors.toList());
        pedido.setLancheCombos(lancheCombos);
        
        pedido.setValorTotal(dto.getValorTotal());
        pedido.setMetodoPagamento(dto.getMetodoPagamento());
        return pedido;
    }
}

