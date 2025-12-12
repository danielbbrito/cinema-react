package com.cinema.spring.repository;

import com.cinema.spring.model.LancheCombo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LancheComboRepository extends JpaRepository<LancheCombo, Long> {
}

