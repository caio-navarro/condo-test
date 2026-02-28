// --- CONFIGURAÇÃO INICIAL ---
document.addEventListener('DOMContentLoaded', function () {
    // Tenta preencher o nome do condomínio visualmente
    const nomeCondominio = localStorage.getItem('nomeCondominio') || "Condomínio não identificado";
    const displayCondo = document.getElementById('nome-condominio-display');
    if (displayCondo) displayCondo.textContent = nomeCondominio;

    // Configura o formulário
    const form = document.getElementById('endereco-form');
    if (form) {
        form.addEventListener('submit', atualizarEndereco);
    }

    // Configura botões do modal
    const btnClose = document.getElementById('erro-modal-close');
    const backdrop = document.getElementById('erro-modal-backdrop');
    if (btnClose) btnClose.onclick = fecharModal;
    if (backdrop) backdrop.onclick = fecharModal;
});

// --- FUNÇÕES DO MODAL ---
function mostrarModal(listaMensagens, isSuccess = false) {
    const modal = document.getElementById("erro-modal");
    const lista = document.getElementById("erro-list");
    const icon = document.getElementById("modal-icon");
    const title = document.getElementById("modal-title");

    if (!modal) return alert(listaMensagens[0]);

    lista.innerHTML = "";
    listaMensagens.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg;
        lista.appendChild(li);
    });

    if (isSuccess) {
        icon.textContent = "check_circle";
        icon.className = "material-symbols-outlined text-3xl text-green-600";
        title.textContent = "Sucesso!";
    } else {
        icon.textContent = "error_outline";
        icon.className = "material-symbols-outlined text-3xl text-red-600";
        title.textContent = "Atenção";
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function fecharModal() {
    const modal = document.getElementById("erro-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
}

// --- LÓGICA DE ATUALIZAÇÃO ---
async function atualizarEndereco(event) {
    event.preventDefault();

    // Pega os valores pelos novos IDs
    const rua = document.getElementById('input-rua').value.trim();
    const numero = document.getElementById('input-numero').value.trim();

    // Validação
    const erros = [];
    if (!rua) erros.push("Informe a Rua/Bloco.");
    if (!numero) erros.push("Informe o Número/Apartamento.");

    if (erros.length > 0) {
        mostrarModal(erros);
        return;
    }

    const moradorId = localStorage.getItem('id');
    if (!moradorId) {
        mostrarModal(["Sessão expirada. Faça login novamente."]);
        setTimeout(() => window.location.href = '../pagInicial/login.html', 2000);
        return;
    }

    const btnSubmit = event.target.querySelector('button');
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Salvando...';

    try {
        const dados = { rua, numero };

        const response = await fetch(`http://localhost:8080/morador/${moradorId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error(`Erro ao atualizar: ${response.status}`);

        const resultado = await response.json();

        // Atualiza LocalStorage
        localStorage.setItem('id', resultado.id);
        localStorage.setItem('nome', resultado.nome);
        localStorage.setItem('cpf', resultado.cpf);
        if (resultado.condominio) localStorage.setItem('idCondominio', resultado.condominio.id);
        if (resultado.endereco) localStorage.setItem('endereco', JSON.stringify(resultado.endereco));

        // Sucesso
        mostrarModal(["Endereço atualizado com sucesso! Redirecionando..."], true);

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    } catch (erro) {
        console.error(erro);
        mostrarModal(["Erro ao salvar endereço. Tente novamente."]);
        
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
    }
}