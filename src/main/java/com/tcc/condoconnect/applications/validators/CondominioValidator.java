package com.tcc.condoconnect.applications.validators;

import com.tcc.condoconnect.repositories.CondominioRepository;
import com.tcc.condoconnect.repositories.MoradorRepository;
import com.tcc.condoconnect.repositories.SindicoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CondominioValidator {

    @Autowired
    private CondominioRepository condominioRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    public void validarCnpjDuplicado(String cnpj) {

        if (condominioRepository.existsByCnpj(cnpj)) {
            throw new RuntimeException("CNPJ já cadastrado!");
        }
    }

    public void validarEmailDuplicado(String email) {
        if (moradorRepository.existsByEmail(email) || sindicoRepository.existsByEmail(email)
                || condominioRepository.existsByEmail(email)) {
            throw new RuntimeException("Email já cadastrado!");
        }
    }
}
