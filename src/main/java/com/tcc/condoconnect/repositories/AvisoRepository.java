package com.tcc.condoconnect.repositories;

import com.tcc.condoconnect.models.Aviso;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvisoRepository extends JpaRepository<Aviso, Long> {

    List<Aviso> findByCondominioId(Long idCondominio);
}
