package com.cinema.spring.controller;

import com.cinema.spring.dto.SessaoDTO;
import com.cinema.spring.service.SessaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sessoes")
@RequiredArgsConstructor
public class SessaoController {
    private final SessaoService sessaoService;

    @GetMapping
    public ResponseEntity<List<SessaoDTO>> findAll() {
        return ResponseEntity.ok(sessaoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessaoDTO> findById(@PathVariable Long id) {
        return sessaoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SessaoDTO> create(@RequestBody SessaoDTO sessaoDTO) {
        SessaoDTO saved = sessaoService.save(sessaoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessaoDTO> update(@PathVariable Long id, @RequestBody SessaoDTO sessaoDTO) {
        return sessaoService.update(id, sessaoDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!sessaoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            sessaoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}

