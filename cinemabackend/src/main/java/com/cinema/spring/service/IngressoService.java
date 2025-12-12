package com.cinema.spring.service;

import com.cinema.spring.dto.IngressoDTO;
import com.cinema.spring.model.Ingresso;
import com.cinema.spring.model.Sessao;
import com.cinema.spring.repository.IngressoRepository;
import com.cinema.spring.repository.SessaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngressoService {
    private final IngressoRepository ingressoRepository;
    private final SessaoRepository sessaoRepository;

    public List<IngressoDTO> findAll() {
        return ingressoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<IngressoDTO> findById(Long id) {
        return ingressoRepository.findById(id)
                .map(this::toDTO);
    }

    @Transactional
    public IngressoDTO save(IngressoDTO dto) {
        Ingresso ingresso = toEntity(dto);
        Ingresso saved = ingressoRepository.save(ingresso);
        return toDTO(saved);
    }

    @Transactional
    public Optional<IngressoDTO> update(Long id, IngressoDTO dto) {
        return ingressoRepository.findById(id)
                .map(existing -> {
                    Ingresso ingresso = toEntity(dto);
                    ingresso.setId(id);
                    Ingresso updated = ingressoRepository.save(ingresso);
                    return toDTO(updated);
                });
    }

    public void deleteById(Long id) {
        ingressoRepository.deleteById(id);
    }

    private IngressoDTO toDTO(Ingresso ingresso) {
        IngressoDTO dto = new IngressoDTO();
        dto.setId(ingresso.getId());
        dto.setValorInteira(ingresso.getValorInteira());
        dto.setValorMeia(ingresso.getValorMeia());
        dto.setSessao(ingresso.getSessao().getId());
        return dto;
    }

    private Ingresso toEntity(IngressoDTO dto) {
        Ingresso ingresso = new Ingresso();
        ingresso.setId(dto.getId());
        ingresso.setValorInteira(dto.getValorInteira());
        ingresso.setValorMeia(dto.getValorMeia());
        
        Sessao sessao = sessaoRepository.findById(dto.getSessao())
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada com id: " + dto.getSessao()));
        ingresso.setSessao(sessao);
        
        return ingresso;
    }
}

