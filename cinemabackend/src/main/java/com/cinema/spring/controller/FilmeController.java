package com.cinema.spring.controller;

import com.cinema.spring.model.Filme;
import com.cinema.spring.service.FilmeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/filmes")
@RequiredArgsConstructor
public class FilmeController {
    private final FilmeService filmeService;

    @GetMapping
    public ResponseEntity<List<Filme>> findAll() {
        return ResponseEntity.ok(filmeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filme> findById(@PathVariable Long id) {
        return filmeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Filme> create(@RequestBody Filme filme) {
        Filme saved = filmeService.save(filme);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Filme> update(@PathVariable Long id, @RequestBody Filme filme) {
        return filmeService.findById(id)
                .map(existing -> {
                    Filme updated = filmeService.update(id, filme);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!filmeService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            filmeService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}

