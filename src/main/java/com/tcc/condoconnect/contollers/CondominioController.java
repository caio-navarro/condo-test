package com.tcc.condoconnect.contollers;

import com.tcc.condoconnect.dtos.CodigoResponse;
import com.tcc.condoconnect.dtos.CondominioRequest;
import com.tcc.condoconnect.facade.CondominioFacade;
import com.tcc.condoconnect.models.Condominio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/condominio")
@CrossOrigin(origins = "*")
public class CondominioController {

    @Autowired
    private CondominioFacade condominioFacade;

    @GetMapping
    public List<Condominio> listar() {
        return condominioFacade.listar();
    }

    @PostMapping
    public Condominio cadastrar(@RequestBody CondominioRequest condominioRequest) {
        return condominioFacade.cadastrar(condominioRequest);
    }

    @PutMapping
    public Condominio atualizar(@RequestBody Condominio condominio) {
        return condominioFacade.atualizar(condominio);
    }

    @PostMapping("/{id}/gerar-codigo")
    public ResponseEntity<CodigoResponse> gerarNovoCodigo(@PathVariable Long id) {
        return condominioFacade.gerarNovoCodigo(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        condominioFacade.deletar(id);
    }
}
