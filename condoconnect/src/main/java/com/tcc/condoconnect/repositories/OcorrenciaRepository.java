package com.tcc.condoconnect.repositories;

import com.tcc.condoconnect.models.Ocorrencia;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

    List<Ocorrencia> findByCondominioId(Long idCondominio);
}
