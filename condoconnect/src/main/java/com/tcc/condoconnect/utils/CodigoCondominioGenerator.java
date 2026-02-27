package com.tcc.condoconnect.utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class CodigoCondominioGenerator {
    private static final String LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String NUMEROS = "0123456789";
    private static final SecureRandom random = new SecureRandom();

    public String gerarCodigoCondominio() {
        StringBuilder codigo = new StringBuilder();

        for (int i = 0; i < 3; i++) {
            int indexLetra = random.nextInt(LETRAS.length());
            codigo.append(LETRAS.charAt(indexLetra));
        }

        for (int i = 0; i < 2; i++) {
            int indexNumero = random.nextInt(NUMEROS.length());
            codigo.append(NUMEROS.charAt(indexNumero));
        }

        return codigo.toString();
    }
}
