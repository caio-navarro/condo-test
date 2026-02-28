package com.tcc.condoconnect.dtos;

import com.tcc.condoconnect.models.EnderecoMorador;

public record UsuarioRequest(Long id, String nome, String cpf, String senha, String email, String telefone,
        String codigoCondominio, EnderecoMorador enderecoMorador) {

    public void validar() {
        if (senha == null || senha.isBlank()) {
            throw new IllegalArgumentException("A senha precisa ter ao menos 6 digitos!");
        }

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

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("O telefone é obrigatório.");
        }
        String telLimpo = telefone.replaceAll("\\D", "");
        if (!telLimpo.matches("^\\d{11}$")) {
            throw new IllegalArgumentException("O telefone deve conter DDD e 9 dígitos (ex: 75999998888).");
        }

        if (codigoCondominio == null) {
            throw new IllegalArgumentException("O código do condomínio é obrigatório.");
        }

        if (cpf == null) {
            throw new IllegalArgumentException("O CPF é obrigatório.");
        }

        String cpfLimpo = cpf.replaceAll("\\D", "");

        if (cpfLimpo.length() != 11 || !cpfLimpo.matches("\\d{11}")) {
            throw new IllegalArgumentException("O CPF deve conter 11 dígitos numéricos.");
        }

        if (cpfLimpo.chars().distinct().count() == 1) {
            throw new IllegalArgumentException("O CPF informado é inválido.");
        }

        if (!isCpfValido(cpfLimpo)) {
            throw new IllegalArgumentException("O CPF informado é inválido.");
        }
    }

    private static boolean isCpfValido(String cpf) {
        try {
            int soma1 = 0, soma2 = 0;

            for (int i = 0; i < 9; i++) {
                int digito = Character.getNumericValue(cpf.charAt(i));
                soma1 += digito * (10 - i);
            }

            int resto1 = soma1 % 11;
            int digitoVerificador1 = (resto1 < 2) ? 0 : 11 - resto1;

            for (int i = 0; i < 10; i++) {
                int digito = Character.getNumericValue(cpf.charAt(i));
                soma2 += digito * (11 - i);
            }

            int resto2 = soma2 % 11;
            int digitoVerificador2 = (resto2 < 2) ? 0 : 11 - resto2;

            return cpf.charAt(9) == Character.forDigit(digitoVerificador1, 10) &&
                    cpf.charAt(10) == Character.forDigit(digitoVerificador2, 10);
        } catch (Exception e) {
            return false;
        }
    }

}