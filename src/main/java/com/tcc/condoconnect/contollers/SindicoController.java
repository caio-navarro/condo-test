package com.tcc.condoconnect.contollers;

import com.tcc.condoconnect.dtos.AtualizarStatusRequest;
import com.tcc.condoconnect.dtos.UsuarioRequest;
import com.tcc.condoconnect.facade.SindicoFacade;
import com.tcc.condoconnect.models.Sindico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sindico")
@CrossOrigin(origins = "*")
public class SindicoController {

    @Autowired
    private SindicoFacade sindicoFacade;

    @GetMapping
    public List<Sindico> listar() {
        return sindicoFacade.listar();
    }

    @GetMapping("/pendentes")
    public List<Sindico> sindicosPendentes() {
        return sindicoFacade.sindicosPendentes();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestBody AtualizarStatusRequest request) {
        return sindicoFacade.atualizarStatus(id, request);
    }

    @PostMapping
    public Sindico cadastrar(@RequestBody UsuarioRequest sindicoRequest) {
        return sindicoFacade.cadastrar(sindicoRequest);
    }

    @PutMapping
    public Sindico atualizar(@RequestBody Sindico sindico) {
        return sindicoFacade.atualizar(sindico);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        sindicoFacade.deletar(id);
    }
}
