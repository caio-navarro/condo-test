package com.tcc.condoconnect.facade;

import com.tcc.condoconnect.applications.CondominioApplication;
import com.tcc.condoconnect.dtos.CodigoResponse;
import com.tcc.condoconnect.dtos.CondominioRequest;
import com.tcc.condoconnect.models.Condominio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class CondominioFacade {

    @Autowired
    private CondominioApplication condominioApplication;

    public List<Condominio> listar() {
        return condominioApplication.listar();
    }

    public Condominio cadastrar(CondominioRequest condominioRequest) {

        return condominioApplication.cadastrar(condominioRequest);
    }

    public void deletar(Long id) {
        condominioApplication.deletar(id);
    }

    public ResponseEntity<CodigoResponse> gerarNovoCodigo(Long id) {
        try {
            CodigoResponse response = condominioApplication.gerarNovoCodigo(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public Condominio atualizar(Condominio condominio) {
        return condominioApplication.atualizar(condominio);
    }
}