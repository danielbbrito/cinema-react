package com.cinema.spring.service;

import com.cinema.spring.model.Sala;
import com.cinema.spring.repository.SalaRepository;
import com.cinema.spring.repository.SessaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SalaService {
    private final SalaRepository salaRepository;
    private final SessaoRepository sessaoRepository;

    public List<Sala> findAll() {
        return salaRepository.findAll();
    }

    public Optional<Sala> findById(Long id) {
        return salaRepository.findById(id);
    }

    public Sala save(Sala sala) {
        return salaRepository.save(sala);
    }

    public Sala update(Long id, Sala sala) {
        sala.setId(id);
        return salaRepository.save(sala);
    }

    @Transactional
    public void deleteById(Long id) {
        List<com.cinema.spring.model.Sessao> sessoes = sessaoRepository.findBySalaId(id);
        
        if (!sessoes.isEmpty()) {
            throw new RuntimeException("Não é possível excluir a sala pois existem " + sessoes.size() + " sessão(ões) associada(s) a ela.");
        }
        
        salaRepository.deleteById(id);
    }
}

