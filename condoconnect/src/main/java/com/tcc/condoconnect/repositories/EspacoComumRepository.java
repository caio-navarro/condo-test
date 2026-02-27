package com.tcc.condoconnect.repositories;

import com.tcc.condoconnect.models.EspacoComum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspacoComumRepository extends JpaRepository<EspacoComum, Long> {
}
