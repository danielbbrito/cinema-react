package com.cinema.spring.controller;

import com.cinema.spring.dto.IngressoDTO;
import com.cinema.spring.service.IngressoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingresso")
@RequiredArgsConstructor
public class IngressoController {
    private final IngressoService ingressoService;

    @GetMapping
    public ResponseEntity<List<IngressoDTO>> findAll() {
        return ResponseEntity.ok(ingressoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngressoDTO> findById(@PathVariable Long id) {
        return ingressoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<IngressoDTO> create(@RequestBody IngressoDTO ingressoDTO) {
        IngressoDTO saved = ingressoService.save(ingressoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngressoDTO> update(@PathVariable Long id, @RequestBody IngressoDTO ingressoDTO) {
        return ingressoService.update(id, ingressoDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (ingressoService.findById(id).isPresent()) {
            ingressoService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

