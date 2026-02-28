const API_BASE_URL = '/api';

let moradores = [];
let idSelecionado = null;
let acaoSelecionada = null; // 'aprovar' ou 'recusar'

document.addEventListener('DOMContentLoaded', () => {
    carregarMoradores();
    setupModais();
});

// --- MODAIS ---
function setupModais() {
    // Configura botões do modal de confirmação
    const btnCancel = document.getElementById('btn-cancel');
    const btnConfirm = document.getElementById('btn-confirm');
    const backdropConfirm = document.getElementById('confirm-backdrop');
    
    if(btnCancel) btnCancel.onclick = fecharModais;
    if(backdropConfirm) backdropConfirm.onclick = fecharModais;
    
    if(btnConfirm) {
        btnConfirm.onclick = async () => {
            fecharModais();
            if (idSelecionado && acaoSelecionada) {
                if (acaoSelecionada === 'aprovar') await enviarAprovacao(idSelecionado);
                else if (acaoSelecionada === 'recusar') await enviarRecusa(idSelecionado);
            }
        };
    }

    // Configura botões do modal de feedback
    const btnCloseErro = document.getElementById('erro-modal-close');
    const backdropErro = document.getElementById('erro-modal-backdrop');
    
    if(btnCloseErro) btnCloseErro.onclick = fecharModais;
    if(backdropErro) backdropErro.onclick = fecharModais;
}

function fecharModais() {
    const m1 = document.getElementById('confirm-modal');
    const m2 = document.getElementById('erro-modal');
    if(m1) { m1.classList.add('hidden'); m1.classList.remove('flex'); }
    if(m2) { m2.classList.add('hidden'); m2.classList.remove('flex'); }
}

// Funções chamadas pelos botões da tabela
function abrirModalAprovacao(id) {
    idSelecionado = id;
    acaoSelecionada = 'aprovar';
    
    const modal = document.getElementById('confirm-modal');
    const msg = document.getElementById('confirm-message');
    const btn = document.getElementById('btn-confirm');

    if(!modal) return console.error("Modal não encontrado");

    msg.textContent = "Tem certeza que deseja APROVAR este morador? Ele terá acesso ao sistema.";
    btn.className = "flex-1 rounded-lg bg-green-600 py-2.5 font-bold text-white hover:bg-green-700 shadow-sm";
    btn.textContent = "Sim, Aprovar";

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function abrirModalRecusa(id) {
    idSelecionado = id;
    acaoSelecionada = 'recusar';
    
    const modal = document.getElementById('confirm-modal');
    const msg = document.getElementById('confirm-message');
    const btn = document.getElementById('btn-confirm');

    if(!modal) return console.error("Modal não encontrado");

    msg.textContent = "Tem certeza que deseja RECUSAR este cadastro?";
    btn.className = "flex-1 rounded-lg bg-red-600 py-2.5 font-bold text-white hover:bg-red-700 shadow-sm";
    btn.textContent = "Sim, Recusar";

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function mostrarFeedback(mensagem, isSuccess) {
    const modal = document.getElementById('erro-modal');
    const list = document.getElementById('erro-list');
    const icon = document.getElementById('modal-icon');
    const title = document.getElementById('modal-title');

    if(!modal) return alert(mensagem);

    list.innerHTML = `<li>${mensagem}</li>`;
    
    if (isSuccess) {
        icon.textContent = "check_circle";
        icon.className = "material-symbols-outlined text-3xl text-green-600";
        title.textContent = "Sucesso";
    } else {
        icon.textContent = "error_outline";
        icon.className = "material-symbols-outlined text-3xl text-red-600";
        title.textContent = "Atenção";
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// --- API ---

async function carregarMoradores() {
    try {
        const response = await fetch(`${API_BASE_URL}/morador/moradores-pendentes`);
        if (!response.ok) throw new Error('Erro ao carregar.');
        moradores = await response.json();
        renderizarMoradores();
    } catch (error) {
        console.error(error);
        const tbody = document.querySelector('tbody');
        if(tbody) tbody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-red-500">Erro ao carregar dados. Verifique o servidor.</td></tr>`;
    }
}

async function enviarAprovacao(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/morador/${id}/aprovar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'aprovado' })
        });
        if (!response.ok) throw new Error();

        mostrarFeedback('Morador aprovado com sucesso!', true);
        removerDaLista(id);
    } catch (e) {
        mostrarFeedback('Erro ao aprovar. Tente novamente.', false);
    }
}

async function enviarRecusa(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/morador/${id}/recusar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'recusado' })
        });
        if (!response.ok) throw new Error();

        mostrarFeedback('Solicitação recusada.', true);
        removerDaLista(id);
    } catch (e) {
        mostrarFeedback('Erro ao recusar.', false);
    }
}

// --- RENDERIZAÇÃO ---

function renderizarMoradores() {
    const tbody = document.querySelector('tbody');
    const mobileList = document.getElementById('mobile-list');

    tbody.innerHTML = '';
    mobileList.innerHTML = '';

    if (moradores.length === 0) {
        const msg = `<div class="p-8 text-center text-gray-500">Nenhuma solicitação pendente.</div>`;
        mobileList.innerHTML = msg;
        tbody.innerHTML = `<tr><td colspan="3">${msg}</td></tr>`;
        return;
    }

    moradores.forEach(m => {
        // Desktop
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-100 dark:border-gray-800";
        tr.innerHTML = `
            <td class="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">${m.nome}</td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">${formatarCPF(m.cpf)}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <button onclick="abrirModalRecusa(${m.id})" 
                        class="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors">
                        Recusar
                    </button>
                    <button onclick="abrirModalAprovacao(${m.id})" 
                        class="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-200 transition-colors">
                        Aprovar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);

        // Mobile
        const card = document.createElement('div');
        card.className = "rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-background-dark";
        card.innerHTML = `
            <div class="flex flex-col gap-2">
                <div>
                    <p class="font-bold text-slate-800 dark:text-white">${m.nome}</p>
                    <p class="text-sm text-gray-500">CPF: ${formatarCPF(m.cpf)}</p>
                </div>
                <div class="mt-2 flex gap-3 border-t border-gray-200 pt-3">
                    <button onclick="abrirModalRecusa(${m.id})" class="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600">Recusar</button>
                    <button onclick="abrirModalAprovacao(${m.id})" class="flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600">Aprovar</button>
                </div>
            </div>
        `;
        mobileList.appendChild(card);
    });
}

function removerDaLista(id) {
    moradores = moradores.filter(m => m.id !== id);
    renderizarMoradores();
}

function formatarCPF(cpf) {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}