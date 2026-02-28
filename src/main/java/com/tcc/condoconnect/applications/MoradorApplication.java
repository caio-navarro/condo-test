package com.tcc.condoconnect.applications;

import com.tcc.condoconnect.applications.validators.UsuarioValidator;
import com.tcc.condoconnect.dtos.UsuarioRequest;
import com.tcc.condoconnect.enums.StatusUsuario;
import com.tcc.condoconnect.models.Condominio;
import com.tcc.condoconnect.models.EnderecoMorador;
import com.tcc.condoconnect.models.Morador;
import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.MoradorRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class MoradorApplication {

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    @Autowired
    private UsuarioValidator usuarioValidator;

    public List<Morador> listar() {
        return moradorRepository.findAll();
    }

    public Morador cadastrar(UsuarioRequest moradorRequest) {
        usuarioValidator.validarCpfDuplicado(moradorRequest.cpf());
        usuarioValidator.validarEmailDuplicado(moradorRequest.email());

        moradorRequest.validar();

        Condominio condominio = condominioRepository.findByCodigo(moradorRequest.codigoCondominio())
                .orElseThrow(() -> new RuntimeException("Código de condominio inválido!"));

        Morador morador = new Morador();
        morador.setId(moradorRequest.id());
        morador.setCondominio(condominio);
        morador.setNome(moradorRequest.nome());
        morador.setEndereco(moradorRequest.enderecoMorador());
        morador.setEmail(moradorRequest.email());
        morador.setTelefone(moradorRequest.telefone());
        morador.setCpf(moradorRequest.cpf());
        morador.setSenha(moradorRequest.senha());

        return moradorRepository.save(morador);
    }

    public List<Morador> moradoresPendentes() {
        return moradorRepository.findAllByStatusUsuario(StatusUsuario.PENDENTE);
    }

    public Morador aprovarMorador(Long id) {
        Optional<Morador> moradorOpt = moradorRepository.findById(id);
        if (moradorOpt.isEmpty()) {
            throw new RuntimeException("Morador não encontrado");
        }
        Morador morador = moradorOpt.get();
        morador.setStatusUsuario(StatusUsuario.ACEITO);
        return moradorRepository.save(morador);
    }

    public Morador recusarMorador(Long id) {
        Optional<Morador> moradorOpt = moradorRepository.findById(id);
        if (moradorOpt.isEmpty()) {
            throw new RuntimeException("Morador não encontrado");
        }
        Morador morador = moradorOpt.get();
        morador.setStatusUsuario(StatusUsuario.INATIVO);
        return moradorRepository.save(morador);
    }

    @Transactional
    public Morador atualizarEndereco(Long id, EnderecoMorador enderecoDTO) { // ← EnderecoDTO
        Morador morador = moradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Morador não encontrado com ID: " + id));

        // Cria ou atualiza o EnderecoMorador embedded
        EnderecoMorador endereco = morador.getEndereco();
        if (endereco == null) {
            endereco = new EnderecoMorador();
        }

        endereco.setRua(enderecoDTO.getRua());
        endereco.setNumero(enderecoDTO.getNumero());
        morador.setEndereco(endereco);

        return moradorRepository.save(morador);
    }

    public void deletar(Long id) {
        moradorRepository.deleteById(id);
    }

    public Morador atualizar(Morador morador) {
        return moradorRepository.save(morador);
    }

}
