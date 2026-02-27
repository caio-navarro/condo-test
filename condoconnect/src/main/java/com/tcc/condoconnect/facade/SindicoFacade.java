package com.tcc.condoconnect.facade;

import com.tcc.condoconnect.applications.SindicoApplication;
import com.tcc.condoconnect.dtos.AtualizarStatusRequest;
import com.tcc.condoconnect.dtos.UsuarioRequest;
import com.tcc.condoconnect.models.Sindico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SindicoFacade {

    @Autowired
    private SindicoApplication sindicoApplication;

    public List<Sindico> listar() {
        return sindicoApplication.listar();
    }

    public ResponseEntity<Void> atualizarStatus(Long id, AtualizarStatusRequest request) {
        sindicoApplication.atualizarStatus(id, request.status());
        return ResponseEntity.noContent().build();
    }

    public Sindico cadastrar(UsuarioRequest usuarioRequest) {

        return sindicoApplication.cadastrar(usuarioRequest);
    }

    public void deletar(Long id) {
        sindicoApplication.deletar(id);
    }

    public List<Sindico> sindicosPendentes() {
        return sindicoApplication.sindicosPendentes();
    }

    public Sindico atualizar(Sindico sindico) {
        return sindicoApplication.atualizar(sindico);
    }
}
