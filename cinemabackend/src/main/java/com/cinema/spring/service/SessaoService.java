package com.cinema.spring.service;

import com.cinema.spring.dto.SessaoDTO;
import com.cinema.spring.model.Filme;
import com.cinema.spring.model.Ingresso;
import com.cinema.spring.model.Sala;
import com.cinema.spring.model.Sessao;
import com.cinema.spring.repository.FilmeRepository;
import com.cinema.spring.repository.IngressoRepository;
import com.cinema.spring.repository.PedidoRepository;
import com.cinema.spring.repository.SalaRepository;
import com.cinema.spring.repository.SessaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessaoService {
    private final SessaoRepository sessaoRepository;
    private final FilmeRepository filmeRepository;
    private final SalaRepository salaRepository;
    private final IngressoRepository ingressoRepository;
    private final PedidoRepository pedidoRepository;

    public List<SessaoDTO> findAll() {
        return sessaoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<SessaoDTO> findById(Long id) {
        return sessaoRepository.findById(id)
                .map(this::toDTO);
    }

    @Transactional
    public SessaoDTO save(SessaoDTO dto) {
        Sessao sessao = toEntity(dto);
        Sessao saved = sessaoRepository.save(sessao);
        
        Optional<Ingresso> existingIngresso = ingressoRepository.findBySessaoId(saved.getId());
        if (existingIngresso.isEmpty()) {
            Ingresso ingresso = new Ingresso();
            ingresso.setSessao(saved);
            ingresso.setValorInteira(20.0);
            ingresso.setValorMeia(10.0);
            ingressoRepository.save(ingresso);
        }
        
        return toDTO(saved);
    }

    @Transactional
    public Optional<SessaoDTO> update(Long id, SessaoDTO dto) {
        return sessaoRepository.findById(id)
                .map(existing -> {
                    Sessao sessao = toEntity(dto);
                    sessao.setId(id);
                    Sessao updated = sessaoRepository.save(sessao);
                    return toDTO(updated);
                });
    }

    @Transactional
    public void deleteById(Long id) {
        Optional<Ingresso> ingresso = ingressoRepository.findBySessaoId(id);
        
        if (ingresso.isPresent()) {
            Long ingressoId = ingresso.get().getId();
            long pedidosCount = pedidoRepository.countByIngressoId(ingressoId);
            
            if (pedidosCount > 0) {
                throw new IllegalArgumentException("Não é possível excluir a sessão pois existem " + pedidosCount + " pedido(s) associado(s) aos ingressos desta sessão.");
            }
            
            ingressoRepository.deleteById(ingressoId);
        }
        
        sessaoRepository.deleteById(id);
    }

    private SessaoDTO toDTO(Sessao sessao) {
        SessaoDTO dto = new SessaoDTO();
        dto.setId(sessao.getId());
        dto.setHorario(sessao.getHorario());
        dto.setFilme(sessao.getFilme().getId());
        dto.setSala(sessao.getSala().getId());
        return dto;
    }

    private Sessao toEntity(SessaoDTO dto) {
        Sessao sessao = new Sessao();
        sessao.setId(dto.getId());
        sessao.setHorario(dto.getHorario());
        
        Filme filme = filmeRepository.findById(dto.getFilme())
                .orElseThrow(() -> new RuntimeException("Filme não encontrado com id: " + dto.getFilme()));
        sessao.setFilme(filme);
        
        Sala sala = salaRepository.findById(dto.getSala())
                .orElseThrow(() -> new RuntimeException("Sala não encontrada com id: " + dto.getSala()));
        sessao.setSala(sala);
        
        return sessao;
    }
}

