package com.tcc.condoconnect.applications;

import com.tcc.condoconnect.dtos.ReservaEspacoRequest;
import com.tcc.condoconnect.models.Condominio;
import com.tcc.condoconnect.models.EspacoComum;
import com.tcc.condoconnect.models.Morador;
import com.tcc.condoconnect.models.ReservaEspaco;
import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.EspacoComumRepository;
import com.tcc.condoconnect.repositories.MoradorRepository;
import com.tcc.condoconnect.repositories.ReservaEspacoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReservaEspacoApplication {

    @Autowired
    private ReservaEspacoRepository reservaEspacoRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private EspacoComumRepository espacoComumRepository;

    public List<ReservaEspaco> listar() {
        return reservaEspacoRepository.findAll();
    }

    public ReservaEspaco cadastrar(ReservaEspacoRequest reservaEspacoRequest) {

        Condominio condominio = condominioRepository.findById(reservaEspacoRequest.idCondominio())
                .orElseThrow(() -> new RuntimeException("Condomínio não encontrado!"));

        Morador morador = moradorRepository.findById(reservaEspacoRequest.idMorador())
                .orElseThrow(() -> new RuntimeException("Morador não encontrado!"));

        EspacoComum espacoComum = espacoComumRepository.findById(reservaEspacoRequest.idEspaco())
                .orElseThrow(() -> new RuntimeException("Espaço não encontrado!"));

        ReservaEspaco reservaEspaco = new ReservaEspaco();
        reservaEspaco.setId(reservaEspacoRequest.id());
        reservaEspaco.setObservacao(reservaEspacoRequest.observacao());
        reservaEspaco.setDataInicio(reservaEspacoRequest.dataInicio());
        reservaEspaco.setDataFim(reservaEspacoRequest.dataFim());
        reservaEspaco.setCondominio(condominio);
        reservaEspaco.setMorador(morador);
        reservaEspaco.setEspaco(espacoComum);

        return reservaEspacoRepository.save(reservaEspaco);
    }

    public void deletar(Long id) {
        reservaEspacoRepository.deleteById(id);
    }

    public ReservaEspaco atualizar(ReservaEspaco reservaEspaco) {
        return reservaEspacoRepository.save(reservaEspaco);
    }
}
