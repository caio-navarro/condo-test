package com.tcc.condoconnect.repositories;

import com.tcc.condoconnect.enums.StatusUsuario;
import com.tcc.condoconnect.models.Morador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MoradorRepository extends JpaRepository<Morador, Long> {
    Optional<Morador> findByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByEmail(String email);

    Optional<Morador> findByEmailAndSenha(String email, String senha);

    List<Morador> findAllByStatusUsuario(StatusUsuario statusUsuario);
}
