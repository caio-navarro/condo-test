package com.tcc.condoconnect.dtos;

public record OcorrenciaRequest(Long idMorador, Long idCondominio, String titulo, String categoria,
        String descricao) {
    public void validar() {
        if (titulo == null || titulo.length() < 4) {
            throw new IllegalArgumentException("O título precisa ter ao menos 6 caracteres!");
        }
    }
}
