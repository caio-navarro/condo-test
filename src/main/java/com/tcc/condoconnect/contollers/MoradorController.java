package com.tcc.condoconnect.contollers;

import com.tcc.condoconnect.dtos.UsuarioRequest;
import com.tcc.condoconnect.facade.MoradorFacade;
import com.tcc.condoconnect.models.EnderecoMorador;
import com.tcc.condoconnect.models.Morador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/morador")
public class MoradorController {

    @Autowired
    private MoradorFacade moradorFacade;

    @GetMapping
    public List<Morador> listar() {
        return moradorFacade.listar();
    }

    @PostMapping
    public Morador cadastrar(@RequestBody UsuarioRequest moradorRequest) {
        return moradorFacade.cadastrar(moradorRequest);
    }

    @PutMapping
    public Morador atualizar(@RequestBody Morador morador) {
        return moradorFacade.atualizar(morador);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Morador> atualizarEndereco(
            @PathVariable Long id,
            @RequestBody EnderecoMorador enderecoDTO) { // ← EnderecoDTO, não EnderecoMorador
        return moradorFacade.atualizarEndereco(id, enderecoDTO);
    }

    @GetMapping("/moradores-pendentes")
    public List<Morador> moradoresPendentes() {
        return moradorFacade.moradoresPendentes();
    }

    @PutMapping("/{id}/aprovar")
    public Morador aprovarMorador(@PathVariable Long id) {
        return moradorFacade.aprovarMorador(id);
    }

    @PutMapping("/{id}/recusar")
    public Morador recusarMorador(@PathVariable Long id) {
        return moradorFacade.recusarMorador(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        moradorFacade.deletar(id);
    }
}
