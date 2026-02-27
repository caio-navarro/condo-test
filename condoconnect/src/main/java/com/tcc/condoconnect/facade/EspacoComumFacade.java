package com.tcc.condoconnect.facade;

import com.tcc.condoconnect.applications.EspacoComumApplication;
import com.tcc.condoconnect.dtos.EspacoComumRequest;
import com.tcc.condoconnect.models.EspacoComum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EspacoComumFacade {

    @Autowired
    private EspacoComumApplication espacoApplication;

    public List<EspacoComum> listar() {
        return espacoApplication.listar();
    }

    public EspacoComum cadastrar(EspacoComumRequest espacoComumRequest) {
        return espacoApplication.cadastrar(espacoComumRequest);
    }

    public void deletar(Long id) {
        espacoApplication.deletar(id);
    }

    public EspacoComum atualizar(EspacoComum espacoComum) {
        return espacoApplication.atualizar(espacoComum);
    }
}
