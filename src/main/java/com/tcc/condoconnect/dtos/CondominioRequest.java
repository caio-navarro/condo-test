package com.tcc.condoconnect.dtos;

import com.tcc.condoconnect.models.EnderecoCondominio;

public record CondominioRequest(Long id, String nome, EnderecoCondominio endereco, String cnpj, String senha, String email, String telefone) {

    public void validar() {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("O nome é obrigatório.");
        }
        if (nome.length() < 4) {
            throw new IllegalArgumentException("O nome deve ter pelo menos 4 caracteres.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("O e-mail é obrigatório.");
        }

        String emailRegex = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";
        if (!email.matches(emailRegex)) {
            throw new IllegalArgumentException("O e-mail informado é inválido.");
        }

        if (cnpj == null) {
            throw new IllegalArgumentException("O CNPJ é obrigatório.");
        }

        String cnpjLimpo = cnpj.replaceAll("\\D", "");
        if (cnpjLimpo.length() != 14 || !cnpjLimpo.matches("\\d{14}")) {
            throw new IllegalArgumentException("O CNPJ deve conter 14 dígitos numéricos.");
        }

        if (cnpjLimpo.chars().distinct().count() == 1) {
            throw new IllegalArgumentException("O CNPJ informado é inválido.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("O telefone é obrigatório.");
        }

        String telLimpo = telefone.replaceAll("\\D", "");
        if (!telLimpo.matches("^\\d{11}$")) {
            throw new IllegalArgumentException("O telefone deve conter DDD e 9 dígitos (ex: 75999998888).");
        }
    }
}
