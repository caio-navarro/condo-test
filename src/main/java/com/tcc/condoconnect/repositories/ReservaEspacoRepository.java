package com.tcc.condoconnect.repositories;

import com.tcc.condoconnect.models.ReservaEspaco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaEspacoRepository extends JpaRepository<ReservaEspaco, Long> {
}
