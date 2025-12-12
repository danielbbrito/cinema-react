package com.cinema.spring.repository;

import com.cinema.spring.model.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessaoRepository extends JpaRepository<Sessao, Long> {
    List<Sessao> findByFilmeId(Long filmeId);
    List<Sessao> findBySalaId(Long salaId);
}

