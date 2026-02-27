package com.tcc.condoconnect.models;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "avisos")
public class Aviso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_sindico")
    private Sindico sindico; // quem criou

    @ManyToOne
    @JoinColumn(name = "id_condominio")
    private Condominio condominio; // para qual condomínio

    private String titulo;
    private String descricao;
    private boolean urgente = false;
    private String categoria;
    private LocalDate dataCriacao = LocalDate.now();
}
