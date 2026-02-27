document.addEventListener("DOMContentLoaded", () => {
    carregarSindicosPendentes();
});

async function carregarSindicosPendentes() {
    const lista = document.getElementById("lista-sindicos");

    if (!lista) {
        console.error("Erro: elemento #lista-sindicos não encontrado no HTML.");
        return;
    }

    lista.innerHTML = "<p class='text-sm text-gray-500'>Carregando...</p>";

    try {
        const response = await fetch("http://localhost:8080/sindico/pendentes");

        if (!response.ok) {
            throw new Error("Erro ao buscar síndicos pendentes");
        }

        const dados = await response.json();
        lista.innerHTML = "";

        if (dados.length === 0) {
            lista.innerHTML = `<p class='text-gray-500'>Nenhum síndico pendente.</p>`;
            return;
        }

        dados.forEach(sindico => {
            const fotoPadrao = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

            const foto = sindico.fotoUrl && sindico.fotoUrl.trim() !== ""
                ? sindico.fotoUrl
                : fotoPadrao;

            const card = criarCardSindico(sindico, foto);
            lista.appendChild(card);
        });

    } catch (erro) {
        console.error(erro);
        lista.innerHTML = `<p class='text-red-500'>Erro ao carregar lista de síndicos.</p>`;
    }
}

function criarCardSindico(sindico, foto) {
    const div = document.createElement("div");

    div.className =
        "rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4";

    div.innerHTML = `
        <div class="flex items-center gap-4">
            <img class="h-14 w-14 rounded-full object-cover" src="${foto}" />

            <div>
                <p class="font-bold">${sindico.nome}</p>
                <p class="text-sm text-text-light-secondary dark:text-dark-secondary">
                    CPF: ${sindico.cpf || "Erro ao informar CPF"}
                </p>
            </div>
        </div>

        <div class="flex gap-2 shrink-0">
            <button onclick="recusarSindico(${sindico.id})"
                class="h-10 px-4 flex items-center gap-2 rounded bg-danger/10 text-danger hover:bg-danger/20 text-sm font-semibold">
                <span class="material-symbols-outlined text-base">close</span>
                Recusar
            </button>

            <button onclick="aprovarSindico(${sindico.id})"
                class="h-10 px-4 flex items-center gap-2 rounded bg-success/10 text-success hover:bg-success/20 text-sm font-semibold">
                <span class="material-symbols-outlined text-base">check</span>
                Aceitar
            </button>
        </div>
    `;

    return div;
}

/* ----- APROVAR E RECUSAR ----- */

async function aprovarSindico(id) {
    await atualizarStatus(id, "ACEITO");
}

async function recusarSindico(id) {
    await atualizarStatus(id, "");
}

async function atualizarStatus(id, status) {
    try {
        const response = await fetch(`http://localhost:8080/sindico/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar status do síndico");
        }

        carregarSindicosPendentes();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao atualizar status.");
    }
}