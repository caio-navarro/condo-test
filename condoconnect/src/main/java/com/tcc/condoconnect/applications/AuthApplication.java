package com.tcc.condoconnect.applications;

import com.tcc.condoconnect.dtos.CondominioResponse;
import com.tcc.condoconnect.dtos.LoginRequest;
import com.tcc.condoconnect.dtos.LoginResponse;
import com.tcc.condoconnect.models.Condominio;
import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.MoradorRepository;
import com.tcc.condoconnect.repositories.SindicoRepository;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class AuthApplication {

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        String email = loginRequest.email();
        String senha = loginRequest.senha();

        // ---------- MORADOR ----------
        var moradorOpt = moradorRepository.findByEmailAndSenha(email, senha);
        if (moradorOpt.isPresent()) {
            var m = moradorOpt.get();

            CondominioResponse condominio = mapCondominio(m.getCondominio());

            return ResponseEntity.ok(
                    new LoginResponse(
                            m.getId(),
                            m.getNome(),
                            m.getRole(),
                            m.getStatusUsuario(),
                            condominio));
        }

        // ---------- SÍNDICO ----------
        var sindicoOpt = sindicoRepository.findByEmailAndSenha(email, senha);
        if (sindicoOpt.isPresent()) {
            var s = sindicoOpt.get();

            CondominioResponse condominio = mapCondominio(s.getCondominio());

            return ResponseEntity.ok(
                    new LoginResponse(
                            s.getId(),
                            s.getNome(),
                            s.getRole(),
                            s.getStatusUsuario(),
                            condominio));
        }

        // ---------- CONDOMÍNIO ----------
        var condominioOpt = condominioRepository.findByEmailAndSenha(email, senha);
        if (condominioOpt.isPresent()) {
            var c = condominioOpt.get();

            CondominioResponse condominio = new CondominioResponse(
                    c.getId(),
                    c.getNome(),
                    c.getCodigo());

            return ResponseEntity.ok(
                    new LoginResponse(
                            c.getId(),
                            c.getNome(),
                            c.getRole(),
                            c.getStatusUsuario(),
                            condominio));
        }

        // ---------- LOGIN INVÁLIDO ----------
        return ResponseEntity
                .status(401)
                .body(Map.of("erro", "Email ou senha inválidos"));
    }

    // ===============================
    // MÉTODO AUXILIAR
    // ===============================
    private CondominioResponse mapCondominio(Condominio condominio) {
        if (condominio == null) {
            return null;
        }
        return new CondominioResponse(
                condominio.getId(),
                condominio.getNome(),
                condominio.getCodigo());
    }
}
