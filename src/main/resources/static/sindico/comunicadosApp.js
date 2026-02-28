document.addEventListener("alpine:init", () => {
    Alpine.data("comunicadosApp", () => ({
        open: false,
        showModal: false,
        comunicados: [],
        carregando: false,

        novoComunicado: {
            titulo: "",
            descricao: "",
            categoria: "Informação",
            urgente: false
        },

        getUsuarioLogado() {
            const idSindico = localStorage.getItem("id");
            const idCondominio = localStorage.getItem("idCondominio");

            if (!idSindico || !idCondominio) {
                throw new Error("Usuário não autenticado");
            }

            return {
                idSindico: Number(idSindico),
                idCondominio: Number(idCondominio)
            };
        },

        async listarComunicados() {
            try {
                const { idCondominio } = this.getUsuarioLogado();

                const response = await fetch(
                    `/api/aviso/condominio/${idCondominio}`
                );

                if (!response.ok) {
                    throw new Error("Erro ao listar comunicados");
                }

                this.comunicados = await response.json();
                console.log("Comunicados carregados:", this.comunicados);

            } catch (e) {
                console.error(e);
                alert("Erro ao carregar comunicados");
            }
        },

        async salvarComunicado() {
            try {
                const usuario = this.getUsuarioLogado();

                if (!this.novoComunicado.titulo || !this.novoComunicado.descricao) {
                    alert("Preencha título e descrição");
                    return;
                }

                const payload = {
                    idSindico: usuario.idSindico,
                    idCondominio: usuario.idCondominio,
                    titulo: this.novoComunicado.titulo,
                    descricao: this.novoComunicado.descricao,
                    categoria: this.novoComunicado.categoria,
                    urgente: this.novoComunicado.urgente,
                    dataCriacao: new Date().toISOString().split("T")[0]
                };

                const response = await fetch("/api/aviso", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(await response.text());
                }

                this.showModal = false;
                this.resetForm();
                await this.listarComunicados();

            } catch (e) {
                console.error(e);
                alert("Erro ao criar comunicado");
            }
        },

        async deletarComunicado(id) {
            if (!confirm("Deseja remover este comunicado?")) return;

            try {
                const response = await fetch(
                    `/api/aviso/${id}`,
                    { method: "DELETE" }
                );

                if (!response.ok) {
                    throw new Error("Erro ao deletar");
                }

                this.comunicados = this.comunicados.filter(c => c.id !== id);

            } catch (e) {
                console.error(e);
                alert("Erro ao deletar comunicado");
            }
        },

        resetForm() {
            this.novoComunicado = {
                titulo: "",
                descricao: "",
                categoria: "Informação",
                urgente: false
            };
        },

        formatarData(data) {
            return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
        },

        init() {
            this.listarComunicados();
        }
    }));
});
