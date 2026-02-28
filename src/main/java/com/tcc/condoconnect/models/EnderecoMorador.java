package com.tcc.condoconnect.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class EnderecoMorador {

    private String rua;     // rua interna do condomínio
    private String numero;  // número da casa
}
