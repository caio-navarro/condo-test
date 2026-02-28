package com.tcc.condoconnect.contollers;

import com.tcc.condoconnect.dtos.AvisoRequest;
import com.tcc.condoconnect.facade.AvisoFacade;
import com.tcc.condoconnect.models.Aviso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aviso")
@CrossOrigin(origins = "*")
public class AvisoController {

    @Autowired
    private AvisoFacade avisoFacade;

    @GetMapping
    public List<Aviso> listar() {
        return avisoFacade.listar();
    }

    @PostMapping
    public Aviso cadastrar(@RequestBody AvisoRequest avisoRequest) {
        return avisoFacade.cadastrar(avisoRequest);
    }

    @GetMapping("/condominio/{idCondominio}")
    public ResponseEntity<List<Aviso>> listarPorCondominio(@PathVariable Long idCondominio) {
        return avisoFacade.listarPorCondominio(idCondominio);
    }

    @PutMapping
    public Aviso atualizar(@RequestBody Aviso aviso) {
        return avisoFacade.atualizar(aviso);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        avisoFacade.deletar(id);
    }
}
