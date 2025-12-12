package com.cinema.spring.service;

import com.cinema.spring.model.Filme;
import com.cinema.spring.repository.FilmeRepository;
import com.cinema.spring.repository.SessaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FilmeService {
    private final FilmeRepository filmeRepository;
    private final SessaoRepository sessaoRepository;

    public List<Filme> findAll() {
        return filmeRepository.findAll();
    }

    public Optional<Filme> findById(Long id) {
        return filmeRepository.findById(id);
    }

    public Filme save(Filme filme) {
        return filmeRepository.save(filme);
    }

    public Filme update(Long id, Filme filme) {
        filme.setId(id);
        return filmeRepository.save(filme);
    }

    @Transactional
    public void deleteById(Long id) {
        List<com.cinema.spring.model.Sessao> sessoes = sessaoRepository.findByFilmeId(id);
        
        if (!sessoes.isEmpty()) {
            throw new RuntimeException("Não é possível excluir o filme pois existem " + sessoes.size() + " sessão(ões) associada(s) a ele.");
        }
        
        filmeRepository.deleteById(id);
    }
}

