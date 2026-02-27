// registrarOcorrencia.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const btnSubmit = form.querySelector('button[type="submit"]');
    const btnCancelar = document.querySelector('button[type="button"]');

    // Configuração da API
    const API_BASE_URL = 'http://localhost:8080';

    // Verificar se usuário está logado
    const idMorador = localStorage.getItem('id');
    const idCondominio = localStorage.getItem('idCondominio');

    console.log('Debug - ID Morador:', idMorador);
    console.log('Debug - ID Condomínio:', idCondominio);

    if (!idMorador) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    if (!idCondominio) {
        alert('ID do condomínio não encontrado. Por favor, complete seu cadastro novamente.');
        window.location.href = 'completarEndereco.html';
        return;
    }

    // Função para mostrar loading no botão
    function setLoadingState(isLoading) {
        if (isLoading) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Enviando...</span>
            `;
        } else {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `
                <span class="material-symbols-outlined text-base">send</span>
                <span>Enviar Ocorrência</span>
            `;
        }
    }

    // Função para exibir mensagem de erro
    function mostrarErro(mensagem) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'fixed top-4 right-4 z-50 bg-error text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in';
        alertDiv.innerHTML = `
            <span class="material-symbols-outlined">error</span>
            <span>${mensagem}</span>
            <button onclick="this.parentElement.remove()" class="ml-2 hover:opacity-80">
                <span class="material-symbols-outlined text-xl">close</span>
            </button>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => alertDiv.remove(), 5000);
    }

    // Função para exibir mensagem de sucesso
    function mostrarSucesso(mensagem, protocolo) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'fixed top-4 right-4 z-50 bg-success text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in';
        alertDiv.innerHTML = `
            <span class="material-symbols-outlined">check_circle</span>
            <div>
                <p class="font-semibold">${mensagem}</p>
                <p class="text-sm">Protocolo: #${protocolo}</p>
            </div>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => alertDiv.remove(), 3000);
    }

    // Handler do formulário
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Coletar dados do formulário
        const titulo = document.getElementById('titulo').value.trim();
        const categoria = document.getElementById('categoria').value;
        const descricao = document.getElementById('descricao').value.trim();

        console.log('Valores coletados:');
        console.log('- Título:', titulo);
        console.log('- Categoria:', categoria);
        console.log('- Descrição:', descricao);

        // Validação básica
        if (!titulo || !categoria || !descricao) {
            mostrarErro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Preparar dados para envio
        const dadosOcorrencia = {
            titulo,
            categoria,
            descricao,
            idCondominio: parseInt(idCondominio),
            idMorador: parseInt(idMorador)
        };

        console.log('Enviando dados:', dadosOcorrencia);

        setLoadingState(true);

        try {
            // Fazer requisição POST para o backend
            const response = await fetch(`${API_BASE_URL}/ocorrencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosOcorrencia)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao registrar ocorrência');
            }

            const data = await response.json();

            // Sucesso
            mostrarSucesso('Ocorrência registrada com sucesso!', data.protocolo || data.id);

            // Limpar formulário
            form.reset();

            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'ocorrencias.html';
            }, 2000);

        } catch (error) {
            console.error('Erro ao registrar ocorrência:', error);
            mostrarErro(error.message || 'Erro ao registrar ocorrência. Tente novamente.');
        } finally {
            setLoadingState(false);
        }
    });

    // Handler do botão cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function () {
            const temDados = document.getElementById('titulo').value ||
                document.getElementById('descricao').value;

            if (temDados) {
                if (confirm('Tem certeza que deseja cancelar? Os dados preenchidos serão perdidos.')) {
                    window.location.href = 'ocorrencias.html';
                }
            } else {
                window.location.href = 'ocorrencias.html';
            }
        });
    }
});

// Adicionar CSS para animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);