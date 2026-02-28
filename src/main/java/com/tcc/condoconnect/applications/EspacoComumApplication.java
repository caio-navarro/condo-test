package com.tcc.condoconnect.applications;

import com.tcc.condoconnect.dtos.EspacoComumRequest;
import com.tcc.condoconnect.models.Condominio;
import com.tcc.condoconnect.models.EspacoComum;
import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.EspacoComumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EspacoComumApplication {

    @Autowired
    private EspacoComumRepository espacoComumRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    public List<EspacoComum> listar() {
        return espacoComumRepository.findAll();
    }

    public EspacoComum cadastrar(EspacoComumRequest espacoComumRequest) {
        espacoComumRequest.validar();

        Condominio condominio = condominioRepository.findById(espacoComumRequest.idCondominio())
                .orElseThrow(() -> new RuntimeException("Condominio não encontrado!"));

        EspacoComum espacoComum = new EspacoComum();
        espacoComum.setId(espacoComumRequest.id());
        espacoComum.setNome(espacoComumRequest.nome());
        espacoComum.setDescricao(espacoComumRequest.descricao());
        espacoComum.setCondominio(condominio);

        return espacoComumRepository.save(espacoComum);
    }

    public void deletar(Long id) {
        espacoComumRepository.deleteById(id);
    }

    public EspacoComum atualizar(EspacoComum espacoComum) {
        return espacoComumRepository.save(espacoComum);
    }
}
