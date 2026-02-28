package com.tcc.condoconnect.dtos;

import com.tcc.condoconnect.enums.Role;
import com.tcc.condoconnect.enums.StatusUsuario;

public record LoginResponse(Long id, String nome, Role role, StatusUsuario statusUsuario,
        CondominioResponse condominio) {

}
