package com.tcc.condoconnect.dtos;

import java.time.LocalDateTime;

public record ReservaEspacoRequest(Long id, Long idCondominio, Long idEspaco, Long idMorador, LocalDateTime dataInicio, LocalDateTime dataFim, String observacao) {
}
