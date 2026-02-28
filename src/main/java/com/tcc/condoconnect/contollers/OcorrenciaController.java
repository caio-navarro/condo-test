package com.tcc.condoconnect.contollers;

import com.tcc.condoconnect.dtos.OcorrenciaRequest;
import com.tcc.condoconnect.facade.OcorrenciaFacade;
import com.tcc.condoconnect.models.Ocorrencia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ocorrencia")
public class OcorrenciaController {

    @Autowired
    private OcorrenciaFacade ocorrenciaFacade;

    @GetMapping
    public List<Ocorrencia> listar() {
        return ocorrenciaFacade.listar();
    }

    @PostMapping
    public Ocorrencia cadastrar(@RequestBody OcorrenciaRequest ocorrenciaRequest) {
        return ocorrenciaFacade.cadastrar(ocorrenciaRequest);
    }

    @PutMapping
    public Ocorrencia atualizar(@RequestBody Ocorrencia ocorrencia) {
        return ocorrenciaFacade.atualizar(ocorrencia);
    }

    @GetMapping("/condominio/{idCondominio}")
    public ResponseEntity<List<Ocorrencia>> listarPorCondominio(@PathVariable Long idCondominio) {
        return ocorrenciaFacade.listarPorCondominio(idCondominio);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        ocorrenciaFacade.deletar(id);
    }
}
