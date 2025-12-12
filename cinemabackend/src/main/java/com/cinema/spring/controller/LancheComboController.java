package com.cinema.spring.controller;

import com.cinema.spring.model.LancheCombo;
import com.cinema.spring.service.LancheComboService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lancheCombos")
@RequiredArgsConstructor
public class LancheComboController {
    private final LancheComboService lancheComboService;

    @GetMapping
    public ResponseEntity<List<LancheCombo>> findAll() {
        return ResponseEntity.ok(lancheComboService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LancheCombo> findById(@PathVariable Long id) {
        return lancheComboService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LancheCombo> create(@RequestBody LancheCombo lancheCombo) {
        LancheCombo saved = lancheComboService.save(lancheCombo);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LancheCombo> update(@PathVariable Long id, @RequestBody LancheCombo lancheCombo) {
        return lancheComboService.findById(id)
                .map(existing -> {
                    LancheCombo updated = lancheComboService.update(id, lancheCombo);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!lancheComboService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            lancheComboService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}

