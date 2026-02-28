package com.tcc.condoconnect.applications;

import com.tcc.condoconnect.dtos.OcorrenciaRequest;
import com.tcc.condoconnect.models.Condominio;
import com.tcc.condoconnect.models.Morador;
import com.tcc.condoconnect.models.Ocorrencia;
import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.MoradorRepository;
import com.tcc.condoconnect.repositories.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OcorrenciaApplication {

    @Autowired
    private OcorrenciaRepository ocorrenciaRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    public List<Ocorrencia> listar() {
        return ocorrenciaRepository.findAll();
    }

    public Ocorrencia cadastrar(OcorrenciaRequest ocorrenciaRequest) {
        ocorrenciaRequest.validar();

        Condominio condominio = condominioRepository.findById(ocorrenciaRequest.idCondominio())
                .orElseThrow(() -> new RuntimeException("Condomínio não encontrado!"));

        Morador morador = moradorRepository.findById(ocorrenciaRequest.idMorador())
                .orElseThrow(() -> new RuntimeException("Morador não encontrado!"));

        Ocorrencia ocorrencia = new Ocorrencia();
        ocorrencia.setTitulo(ocorrenciaRequest.titulo());
        ocorrencia.setCategoria(ocorrenciaRequest.categoria().toUpperCase());
        ocorrencia.setDescricao(ocorrenciaRequest.descricao());
        ocorrencia.setCondominio(condominio);
        ocorrencia.setMorador(morador);

        return ocorrenciaRepository.save(ocorrencia);
    }

    public List<Ocorrencia> listarPorCondominio(Long idCondominio) {
        return ocorrenciaRepository.findByCondominioId(idCondominio);
    }

    public void deletar(Long id) {
        ocorrenciaRepository.deleteById(id);
    }

    public Ocorrencia atualizar(Ocorrencia ocorrencia) {
        return ocorrenciaRepository.save(ocorrencia);
    }
}
