package com.tcc.condoconnect.applications.validators;

import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.MoradorRepository;
import com.tcc.condoconnect.repositories.SindicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UsuarioValidator {

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    public void validarCpfDuplicado(String cpf) {
        if (moradorRepository.existsByCpf(cpf) || sindicoRepository.existsByCpf(cpf)) {
            throw new RuntimeException("CPF já cadastrado!");
        }
    }

    public void validarEmailDuplicado(String email) {
        if (moradorRepository.existsByEmail(email) || sindicoRepository.existsByEmail(email)
                || condominioRepository.existsByEmail(email)) {
            throw new RuntimeException("Email já cadastrado!");
        }
    }

}
