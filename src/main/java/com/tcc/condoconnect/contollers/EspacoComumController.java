package com.tcc.condoconnect.contollers;

import com.tcc.condoconnect.dtos.EspacoComumRequest;
import com.tcc.condoconnect.facade.EspacoComumFacade;
import com.tcc.condoconnect.models.EspacoComum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/espaco-comum")
public class EspacoComumController {

    @Autowired
    private EspacoComumFacade espacoFacade;

    @GetMapping
    public List<EspacoComum> listar(){
        return espacoFacade.listar();
    }

    @PostMapping
    public EspacoComum cadastrar(@RequestBody EspacoComumRequest espacoComumRequest){
        return espacoFacade.cadastrar(espacoComumRequest);
    }

    @PutMapping
    public EspacoComum atualizar(@RequestBody EspacoComum espacoComum){
        return espacoFacade.atualizar(espacoComum);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id){
        espacoFacade.deletar(id);
    }
}
