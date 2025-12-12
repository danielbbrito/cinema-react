package com.cinema.spring.repository;

import com.cinema.spring.model.Ingresso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IngressoRepository extends JpaRepository<Ingresso, Long> {
    Optional<Ingresso> findBySessaoId(Long sessaoId);
}

