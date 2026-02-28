package com.tcc.condoconnect.dtos;

public record EspacoComumRequest(Long id, String nome, String descricao, Long idCondominio) {

    public void validar(){
        if(nome == null || nome.length() < 4){
            throw new IllegalArgumentException("O nome precisa ter ao menos 4 digitos!");
        }
    }
}
