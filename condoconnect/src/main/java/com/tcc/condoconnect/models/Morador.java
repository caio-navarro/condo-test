package com.tcc.condoconnect.models;

import com.tcc.condoconnect.enums.Role;
import com.tcc.condoconnect.enums.StatusUsuario;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "moradores")
public class Morador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cpf;
    private String nome;
    private String telefone;
    private String email;
    private String senha;

    @ManyToOne
    @JoinColumn(name = "id_condominio")
    private Condominio condominio;

    @Embedded
    private EnderecoMorador endereco;

    private Role role = Role.MORADOR;
    private StatusUsuario statusUsuario = StatusUsuario.PENDENTE;
}