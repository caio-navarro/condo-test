package com.tcc.condoconnect.models;

import com.tcc.condoconnect.enums.StatusReserva;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reserva_espaco")
public class ReservaEspaco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_espaco")
    private EspacoComum espaco; // espaço reservado

    @ManyToOne
    @JoinColumn(name = "id_condominio")
    private Condominio condominio; // condominio reservado

    @ManyToOne
    @JoinColumn(name = "id_morador")
    private Morador morador; // quem fez a reserva

    private String observacao;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private StatusReserva status = StatusReserva.PENDENTE;
}
