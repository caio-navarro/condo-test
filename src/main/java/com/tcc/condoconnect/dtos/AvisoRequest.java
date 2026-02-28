package com.tcc.condoconnect.dtos;

import java.time.LocalDate;

public record AvisoRequest(Long idSindico, Long idCondominio, String titulo, String descricao,
        boolean urgente, String categoria, LocalDate dataCriacao) {
    public void validar() {
        if (titulo == null || titulo.length() < 6) {
            throw new IllegalArgumentException("O título precisa ter ao menos 6 caracteres!");
        }
    }
}
