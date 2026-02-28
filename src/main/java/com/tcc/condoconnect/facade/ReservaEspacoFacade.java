package com.tcc.condoconnect.facade;

import com.tcc.condoconnect.applications.ReservaEspacoApplication;
import com.tcc.condoconnect.dtos.ReservaEspacoRequest;
import com.tcc.condoconnect.models.ReservaEspaco;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReservaEspacoFacade {

    @Autowired
    private ReservaEspacoApplication reservaApplication;

    public List<ReservaEspaco> listar() {
        return reservaApplication.listar();
    }

    public ReservaEspaco cadastrar(ReservaEspacoRequest reservaEspacoRequest) {

        return reservaApplication.cadastrar(reservaEspacoRequest);
    }

    public void deletar(Long id) {
        reservaApplication.deletar(id);
    }

    public ReservaEspaco atualizar(ReservaEspaco reservaEspaco) {
        return reservaApplication.atualizar(reservaEspaco);
    }
}
