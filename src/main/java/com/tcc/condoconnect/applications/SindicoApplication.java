package com.tcc.condoconnect.applications;

import com.tcc.condoconnect.applications.validators.UsuarioValidator;
import com.tcc.condoconnect.dtos.UsuarioRequest;
import com.tcc.condoconnect.enums.StatusUsuario;
import com.tcc.condoconnect.models.Condominio;
import com.tcc.condoconnect.models.Sindico;
import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.SindicoRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SindicoApplication {

    @Autowired
    private SindicoRepository sindicoRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    @Autowired
    private UsuarioValidator usuarioValidator;

    public List<Sindico> listar() {
        return sindicoRepository.findAll();
    }

    public Sindico cadastrar(UsuarioRequest sindicoRequest) {
        usuarioValidator.validarCpfDuplicado(sindicoRequest.cpf());
        usuarioValidator.validarEmailDuplicado(sindicoRequest.email());

        sindicoRequest.validar();

        Condominio condominio = condominioRepository.findByCodigo(sindicoRequest.codigoCondominio())
                .orElseThrow(() -> new RuntimeException("Código de condominio inválido!"));

        Sindico sindico = new Sindico();
        sindico.setId(sindicoRequest.id());
        sindico.setCondominio(condominio);
        sindico.setNome(sindicoRequest.nome());
        sindico.setEmail(sindicoRequest.email());
        sindico.setTelefone(sindicoRequest.telefone());
        sindico.setCpf(sindicoRequest.cpf());
        sindico.setSenha(sindicoRequest.senha());

        return sindicoRepository.save(sindico);
    }

    public Sindico atualizarStatus(Long id, StatusUsuario status) {
        Sindico sindico = sindicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Síndico não encontrado."));

        sindico.setStatusUsuario(status);
        return sindicoRepository.save(sindico);
    }

    public List<Sindico> sindicosPendentes() {
        return sindicoRepository.findAllByStatusUsuario(StatusUsuario.PENDENTE);
    }

    @Transactional
    public void deletar(Long id) {
        Sindico sindico = sindicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Síndico não encontrado"));

        sindico.setCondominio(null);
        sindicoRepository.save(sindico);

        sindicoRepository.delete(sindico);
    }

    public Sindico atualizar(Sindico sindico) {
        return sindicoRepository.save(sindico);
    }
}