package com.tcc.condoconnect.facade;

import com.tcc.condoconnect.applications.AvisoApplication;
import com.tcc.condoconnect.dtos.AvisoRequest;
import com.tcc.condoconnect.models.Aviso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AvisoFacade {

    @Autowired
    private AvisoApplication avisoApplication;

    public List<Aviso> listar() {
        return avisoApplication.listar();
    }

    public Aviso cadastrar(AvisoRequest avisoRequest) {
        return avisoApplication.cadastrar(avisoRequest);
    }

    public ResponseEntity<List<Aviso>> listarPorCondominio(Long idCondominio) {
        List<Aviso> avisos = avisoApplication.listarPorCondominio(idCondominio);
        return ResponseEntity.ok(avisos);
    }

    public void deletar(Long id) {
        avisoApplication.deletar(id);
    }

    public Aviso atualizar(Aviso aviso) {
        return avisoApplication.atualizar(aviso);
    }
}
