// listarOcorrencias.js
document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = '/api';
    const containerOcorrencias = document.querySelector('.grid');
    const btnCarregarMais = document.querySelector('button');

    let paginaAtual = 0;
    const itensPorPagina = 6;

    // Verificar se usuário está logado
    const idCondominio = localStorage.getItem('idCondominio');

    if (!idCondominio) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    // Função para formatar data relativa
    function formatarDataRelativa(dataString) {
        const data = new Date(dataString);
        const agora = new Date();
        const diffMs = agora - data;
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDias === 0) return 'Hoje';
        if (diffDias === 1) return 'Há 1 dia';
        if (diffDias < 7) return `Há ${diffDias} dias`;
        if (diffDias < 14) return 'Há 1 semana';
        if (diffDias < 30) return `Há ${Math.floor(diffDias / 7)} semanas`;
        return `Há ${Math.floor(diffDias / 30)} meses`;
    }

    // Função para obter cor do status
    function getStatusBadge(status) {
        const badges = {
            'ABERTO': {
                color: 'error',
                text: 'Aberta'
            },
            'EM_ANDAMENTO': {
                color: 'warning',
                text: 'Em Andamento'
            },
            'RESOLVIDO': {
                color: 'success',
                text: 'Resolvida'
            },
            'FECHADO': {
                color: 'success',
                text: 'Fechada'
            }
        };

        const badge = badges[status] || badges['ABERTO'];
        return `<span class="inline-flex items-center rounded-full bg-${badge.color}/10 px-3 py-1 text-xs font-semibold text-${badge.color}">${badge.text}</span>`;
    }

    // Função para formatar categoria
    function formatarCategoria(categoria) {
        if (!categoria) return 'Geral';
        return categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
    }

    // Função para criar card de ocorrência
    function criarCardOcorrencia(ocorrencia) {
        return `
            <div class="flex flex-col rounded-lg bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark p-6">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex flex-col">
                        <p class="text-sm text-subtext-light dark:text-subtext-dark">#${ocorrencia.id}</p>
                        <h3 class="text-lg font-bold text-text-light dark:text-text-dark">${ocorrencia.titulo}</h3>
                        <span class="text-xs text-primary font-medium mt-1">${formatarCategoria(ocorrencia.categoria)}</span>
                    </div>
                    ${getStatusBadge(ocorrencia.status)}
                </div>
                <p class="mt-3 text-sm text-subtext-light dark:text-subtext-dark flex-1 line-clamp-3">
                    ${ocorrencia.descricao}
                </p>
                <div class="mt-4 flex items-center justify-between text-xs text-subtext-light dark:text-subtext-dark">
                    <span>Aberto por: ${ocorrencia.morador?.nome || 'Síndico'}</span>
                    <span>${formatarDataRelativa(ocorrencia.dataAbertura || new Date())}</span>
                </div>
            </div>
        `;
    }

    // Função para exibir mensagem de carregamento
    function mostrarCarregamento() {
        containerOcorrencias.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        `;
    }

    // Função para exibir mensagem de erro
    function mostrarErro(mensagem) {
        containerOcorrencias.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12 gap-4">
                <span class="material-symbols-outlined text-6xl text-error">error</span>
                <p class="text-lg font-semibold text-text-light dark:text-text-dark">${mensagem}</p>
                <button onclick="location.reload()" 
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    Tentar Novamente
                </button>
            </div>
        `;
    }

    // Função para exibir lista vazia
    function mostrarListaVazia() {
        containerOcorrencias.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12 gap-4">
                <span class="material-symbols-outlined text-6xl text-subtext-light dark:text-subtext-dark">inbox</span>
                <p class="text-lg font-semibold text-text-light dark:text-text-dark">Nenhuma ocorrência registrada</p>
                <p class="text-sm text-subtext-light dark:text-subtext-dark">Seja o primeiro a registrar uma ocorrência!</p>
                <button onclick="window.location.href='registrarOcorrencia.html'" 
                    class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <span class="material-symbols-outlined">add_circle</span>
                    <span>Abrir Ocorrência</span>
                </button>
            </div>
        `;
    }

    // Função para carregar ocorrências
    async function carregarOcorrencias() {
        mostrarCarregamento();

        try {
            const response = await fetch(
                `${API_BASE_URL}/ocorrencia/condominio/${idCondominio}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao carregar ocorrências');
            }

            const ocorrencias = await response.json();

            if (!ocorrencias || ocorrencias.length === 0) {
                mostrarListaVazia();
                btnCarregarMais.style.display = 'none';
                return;
            }

            // Ordena por ID decrescente (mais recentes primeiro)
            ocorrencias.sort((a, b) => b.id - a.id);

            // Renderiza os cards
            containerOcorrencias.innerHTML = ocorrencias
                .slice(0, itensPorPagina)
                .map(criarCardOcorrencia)
                .join('');

            // Esconde botão "Carregar mais" se não houver mais itens
            if (ocorrencias.length <= itensPorPagina) {
                btnCarregarMais.style.display = 'none';
            } else {
                btnCarregarMais.style.display = 'flex';
            }

        } catch (error) {
            console.error('Erro ao carregar ocorrências:', error);
            mostrarErro('Erro ao carregar as ocorrências. Por favor, tente novamente.');
            btnCarregarMais.style.display = 'none';
        }
    }

    // Adicionar CSS para line-clamp
    const style = document.createElement('style');
    style.textContent = `
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Carregar ocorrências ao iniciar
    carregarOcorrencias();
});