package com.tcc.condoconnect.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tcc.condoconnect.enums.Role;
import com.tcc.condoconnect.enums.StatusUsuario;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "condominios")
public class Condominio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codigo;
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private String cnpj;

    private Role role = Role.CONDOMINIO;

    @Embedded
    private EnderecoCondominio endereco;
    private StatusUsuario statusUsuario = StatusUsuario.PENDENTE;

    @OneToMany(mappedBy = "condominio", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<EspacoComum> espacosComuns = new ArrayList<>();

}
