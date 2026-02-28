const API_BASE_URL = 'http://localhost:8080'; // Substitua pela URL da sua API

const codigoDisplay = document.querySelector('.font-mono');
const btnGerarNovo = document.querySelector('.bg-primary');
const btnCopiar = document.querySelector('.bg-gray-200');

function formatarCodigo(codigo) {
    if (!codigo) return 'XXXXXX';

    return codigo.replace(/-/g, '').toUpperCase();
}

function carregarCodigoDoLocalStorage() {
    const codCondominio = localStorage.getItem('codCondominio');

    if (codCondominio) {
        codigoDisplay.textContent = formatarCodigo(codCondominio);
    } else {
        codigoDisplay.textContent = 'XXXXXX';
        console.warn('Nenhum código encontrado no localStorage');
    }
}

async function gerarNovoCodigo() {
    try {
        const condominioId = localStorage.getItem('idCondominio');

        if (!condominioId) {
            mostrarNotificacao('ID do condomínio não encontrado. Faça login novamente.', 'error');
            throw new Error('ID do condomínio não encontrado');
        }

        btnGerarNovo.disabled = true;
        btnGerarNovo.innerHTML = `
            <span class="material-symbols-outlined text-2xl animate-spin" style="font-variation-settings:'wght'600;">autorenew</span>
            <span>Gerando...</span>
        `;

        const response = await fetch(`${API_BASE_URL}/condominio/${condominioId}/gerar-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        const novoCodigo = data.codigo || data.codCondominio || data.code;

        if (novoCodigo) {
            localStorage.setItem('codCondominio', novoCodigo);
            codigoDisplay.textContent = formatarCodigo(novoCodigo);
            mostrarNotificacao('Novo código gerado com sucesso!', 'success');
        } else {
            throw new Error('Código não retornado pela API');
        }

    } catch (error) {
        console.error('Erro ao gerar novo código:', error);
        mostrarNotificacao('Erro ao gerar novo código. Tente novamente.', 'error');
    } finally {
        // Reabilita o botão
        btnGerarNovo.disabled = false;
        btnGerarNovo.innerHTML = `
            <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'wght'600;">autorenew</span>
            <span>Gerar Novo Código</span>
        `;
    }
}

async function copiarCodigo() {
    const codigo = codigoDisplay.textContent;

    if (codigo === 'XXXXXX') {
        mostrarNotificacao('Gere um código primeiro!', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(codigo);

        const textoOriginal = btnCopiar.innerHTML;
        btnCopiar.innerHTML = `
            <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL'1,'wght'500;">check</span>
            <span>Copiado!</span>
        `;

        setTimeout(() => {
            btnCopiar.innerHTML = textoOriginal;
        }, 2000);

        mostrarNotificacao('Código copiado para a área de transferência!', 'success');
    } catch (error) {
        console.error('Erro ao copiar:', error);
        mostrarNotificacao('Erro ao copiar código.', 'error');
    }
}


function mostrarNotificacao(mensagem, tipo = 'success') {

    const notificacaoExistente = document.querySelector('.notificacao-toast');
    if (notificacaoExistente) {
        notificacaoExistente.remove();
    }

    const cor = tipo === 'success' ? 'bg-green-500' : 'bg-red-500';

    const toast = document.createElement('div');
    toast.className = `notificacao-toast fixed top-4 right-4 ${cor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in`;
    toast.innerHTML = `
        <span class="material-symbols-outlined">
            ${tipo === 'success' ? 'check_circle' : 'error'}
        </span>
        <span>${mensagem}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fade-out 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


btnGerarNovo.addEventListener('click', gerarNovoCodigo);
btnCopiar.addEventListener('click', copiarCodigo);

document.addEventListener('DOMContentLoaded', carregarCodigoDoLocalStorage);

const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fade-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);