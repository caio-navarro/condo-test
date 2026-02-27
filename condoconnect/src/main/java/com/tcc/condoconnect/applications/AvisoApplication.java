package com.tcc.condoconnect.applications;

import com.tcc.condoconnect.dtos.AvisoRequest;
import com.tcc.condoconnect.models.Aviso;
import com.tcc.condoconnect.models.Sindico;
import com.tcc.condoconnect.models.Condominio;
import com.tcc.condoconnect.repositories.AvisoRepository;
import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.SindicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class AvisoApplication {

    @Autowired
    private AvisoRepository avisoRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    public List<Aviso> listar() {
        return avisoRepository.findAll();
    }

    public Aviso cadastrar(AvisoRequest avisoRequest) {
        avisoRequest.validar();

        Condominio condominio = condominioRepository.findById(avisoRequest.idCondominio())
                .orElseThrow(() -> new RuntimeException("Condomínio não encontrado!"));

        Sindico sindico = sindicoRepository.findById(avisoRequest.idSindico())
                .orElseThrow(() -> new RuntimeException("Sindico não encontrado!"));

        Aviso aviso = new Aviso();
        aviso.setTitulo(avisoRequest.titulo());
        aviso.setDescricao(avisoRequest.descricao());
        aviso.setUrgente(avisoRequest.urgente());
        aviso.setDataCriacao(LocalDate.now());
        aviso.setCategoria(avisoRequest.categoria());
        aviso.setSindico(sindico);
        aviso.setCondominio(condominio);

        return avisoRepository.save(aviso);
    }

    public List<Aviso> listarPorCondominio(Long idCondominio) {
        return avisoRepository.findByCondominioId(idCondominio);
    }

    public void deletar(Long id) {
        avisoRepository.deleteById(id);
    }

    public Aviso atualizar(Aviso aviso) {
        return avisoRepository.save(aviso);
    }
}
