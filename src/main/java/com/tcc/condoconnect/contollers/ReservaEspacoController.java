package com.tcc.condoconnect.contollers;

import com.tcc.condoconnect.dtos.ReservaEspacoRequest;
import com.tcc.condoconnect.facade.ReservaEspacoFacade;
import com.tcc.condoconnect.models.ReservaEspaco;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reserva-espaco")
public class ReservaEspacoController {

    @Autowired
    private ReservaEspacoFacade reservaFacade;

    @GetMapping
    public List<ReservaEspaco> listar(){
        return reservaFacade.listar();
    }

    @PostMapping
    public ReservaEspaco cadastrar(@RequestBody ReservaEspacoRequest reservaEspacoRequest){
        return reservaFacade.cadastrar(reservaEspacoRequest);
    }

    @PutMapping
    public ReservaEspaco atualizar(@RequestBody ReservaEspaco reserva){
        return reservaFacade.atualizar(reserva);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id){
        reservaFacade.deletar(id);
    }
}
