package com.tcc.condoconnect.models;

import com.tcc.condoconnect.enums.StatusEspacoComum;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "espaco_comum")
public class EspacoComum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;
    private StatusEspacoComum statusEspaco = StatusEspacoComum.ATIVO;

    @ManyToOne
    @JoinColumn(name = "id_condominio")
    @JsonIgnore // evita recursividade
    private Condominio condominio;
}
