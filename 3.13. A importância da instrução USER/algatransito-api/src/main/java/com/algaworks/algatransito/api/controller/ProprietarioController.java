package com.algaworks.algatransito.api.controller;


import com.algaworks.algatransito.api.assembler.ProprietarioAssembler;
import com.algaworks.algatransito.api.model.ProprietarioModel;
import com.algaworks.algatransito.api.model.input.ProprietarioInput;
import com.algaworks.algatransito.domain.model.Proprietario;
import com.algaworks.algatransito.domain.repository.ProprietarioRepository;
import com.algaworks.algatransito.domain.service.RegistroProprietarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/proprietarios")
public class ProprietarioController {

    @Autowired
    private ProprietarioRepository proprietarioRepository;

    @Autowired
    private RegistroProprietarioService registroProprietarioService;

    @Autowired
    private ProprietarioAssembler proprietarioAssembler;

    @GetMapping()
    private List<ProprietarioModel> listar() {
        return proprietarioAssembler.toCollectionModel(proprietarioRepository.findAll());
    }

    @GetMapping("/{proprietarioId}")
    private ResponseEntity<ProprietarioModel> buscar(@PathVariable Long proprietarioId) {
        return proprietarioRepository.findById(proprietarioId)
                .map(proprietarioAssembler::toModel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    private ProprietarioModel adicionar(@Valid @RequestBody ProprietarioInput proprietarioInput) {
        Proprietario novoProprietario = proprietarioAssembler.toEntity(proprietarioInput);
        Proprietario proprietario = registroProprietarioService.salvar(novoProprietario);

        return proprietarioAssembler.toModel(proprietario);
    }

    @PutMapping("/{proprietarioId}")
    private ResponseEntity<ProprietarioModel> atualizar(@PathVariable Long proprietarioId, @Valid @RequestBody ProprietarioInput proprietarioInput) {
        if (!proprietarioRepository.existsById(proprietarioId)) {
            return ResponseEntity.notFound().build();
        }

        Proprietario proprietario = proprietarioAssembler.toEntity(proprietarioInput);

        proprietario.setId(proprietarioId);
        Proprietario proprietarioAtualizado = registroProprietarioService.salvar(proprietario);

        ProprietarioModel proprietarioModel = proprietarioAssembler.toModel(proprietarioAtualizado);

        return ResponseEntity.ok(proprietarioModel);
    }

    @DeleteMapping("/{proprietarioId}")
    private ResponseEntity<Void> excluir(@PathVariable Long proprietarioId) {
        if (!proprietarioRepository.existsById(proprietarioId)) {
            return ResponseEntity.notFound().build();
        }

        registroProprietarioService.excluir(proprietarioId);

        return ResponseEntity.noContent().build();
    }
}
