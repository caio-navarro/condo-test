package com.tcc.condoconnect.models;

import com.tcc.condoconnect.enums.StatusOcorrencia;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ocorrencias")
public class Ocorrencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_morador")
    private Morador morador; // quem registrou

    @ManyToOne
    @JoinColumn(name = "id_condominio")
    private Condominio condominio; // para qual condomínio

    private String categoria;

    private String titulo;
    private String descricao;
    private StatusOcorrencia status = StatusOcorrencia.ABERTO;
}
