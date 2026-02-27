package com.tcc.condoconnect.dtos;

import com.tcc.condoconnect.enums.StatusUsuario;

public record AtualizarStatusRequest(StatusUsuario status) {
}
