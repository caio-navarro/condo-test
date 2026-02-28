package com.tcc.condoconnect.repositories;

import com.tcc.condoconnect.models.Sindico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import com.tcc.condoconnect.enums.StatusUsuario;

@Repository
public interface SindicoRepository extends JpaRepository<Sindico, Long> {
    Optional<Sindico> findByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByEmail(String email);

    Optional<Sindico> findByEmailAndSenha(String email, String senha);

    List<Sindico> findAllByStatusUsuario(StatusUsuario status);
}
