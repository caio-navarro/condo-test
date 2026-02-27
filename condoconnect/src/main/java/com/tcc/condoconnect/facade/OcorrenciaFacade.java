package com.tcc.condoconnect.facade;

import com.tcc.condoconnect.applications.OcorrenciaApplication;
import com.tcc.condoconnect.dtos.OcorrenciaRequest;
import com.tcc.condoconnect.models.Ocorrencia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class OcorrenciaFacade {

    @Autowired
    private OcorrenciaApplication ocorrenciaApplication;

    public List<Ocorrencia> listar() {
        return ocorrenciaApplication.listar();
    }

    public Ocorrencia cadastrar(OcorrenciaRequest ocorrenciaRequest) {
        return ocorrenciaApplication.cadastrar(ocorrenciaRequest);
    }

    public ResponseEntity<List<Ocorrencia>> listarPorCondominio(Long idCondominio) {
        List<Ocorrencia> ocorrencias = ocorrenciaApplication.listarPorCondominio(idCondominio);
        return ResponseEntity.ok(ocorrencias);
    }

    public void deletar(Long id) {
        ocorrenciaApplication.deletar(id);
    }

    public Ocorrencia atualizar(Ocorrencia ocorrencia) {
        return ocorrenciaApplication.atualizar(ocorrencia);
    }
}
