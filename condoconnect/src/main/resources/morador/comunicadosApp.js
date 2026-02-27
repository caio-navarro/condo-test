document.addEventListener('DOMContentLoaded', async function () {
    const comunicados = [];
    let filtroAtual = 'Todos';
    let termoBusca = '';

    // Elementos do DOM
    const gridComunicados = document.querySelector('.grid.grid-cols-1');
    const inputBusca = document.querySelector('input[placeholder="Buscar por palavra-chave..."]');
    const botoesCategoria = document.querySelectorAll('.flex.gap-3.p-4.overflow-x-auto .flex.h-10');

    // Função para buscar comunicados da API
    async function carregarComunicados() {
        try {
            const idCondominio = localStorage.getItem("idCondominio");

            if (!idCondominio) {
                console.error("ID do condomínio não encontrado");
                mostrarMensagem("Erro ao carregar comunicados: condomínio não identificado");
                return;
            }

            const response = await fetch(`http://localhost:8080/aviso/condominio/${idCondominio}`);

            if (!response.ok) {
                throw new Error("Erro ao buscar comunicados");
            }

            const dados = await response.json();
            comunicados.length = 0;
            comunicados.push(...dados);

            renderizarComunicados();

        } catch (erro) {
            console.error("Erro ao carregar comunicados:", erro);
            mostrarMensagem("Erro ao carregar comunicados. Tente novamente mais tarde.");
        }
    }

    // Função para mapear categoria da API para exibição
    function mapearCategoria(categoria) {
        const mapa = {
            'Urgente': { texto: 'Urgente', cor: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
            'Manutenção': { texto: 'Manutenção', cor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
            'Eventos': { texto: 'Eventos', cor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
            'Informativo': { texto: 'Informativo', cor: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
            'Informação': { texto: 'Informativo', cor: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' }
        };

        return mapa[categoria] || mapa['Informativo'];
    }

    // Função para formatar data
    function formatarData(dataString) {
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    // Função para filtrar comunicados
    function filtrarComunicados() {
        return comunicados.filter(comunicado => {
            // Filtro por categoria
            const passaCategoria = filtroAtual === 'Todos' ||
                comunicado.categoria === filtroAtual ||
                (filtroAtual === 'Informativo' && comunicado.categoria === 'Informação');

            // Filtro por busca
            const passaBusca = termoBusca === '' ||
                comunicado.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
                comunicado.descricao.toLowerCase().includes(termoBusca.toLowerCase());

            return passaCategoria && passaBusca;
        });
    }

    // Função para renderizar comunicados
    function renderizarComunicados() {
        const comunicadosFiltrados = filtrarComunicados();

        if (comunicadosFiltrados.length === 0) {
            gridComunicados.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400 text-lg">
                        ${comunicados.length === 0 ? 'Nenhum comunicado disponível no momento.' : 'Nenhum comunicado encontrado com os filtros aplicados.'}
                    </p>
                </div>
            `;
            return;
        }

        gridComunicados.innerHTML = comunicadosFiltrados.map(comunicado => {
            const categoria = mapearCategoria(comunicado.categoria);
            const dataFormatada = formatarData(comunicado.dataCriacao);

            return `
                <div class="flex flex-col items-stretch justify-start rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white dark:bg-gray-800 transition-transform duration-300 hover:scale-[1.02]">
                    <div class="flex h-full w-full flex-col items-stretch gap-3 p-6">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div class="flex items-center gap-2">
                                <span class="inline-flex items-center rounded-md ${categoria.cor} px-2.5 py-1 text-xs font-semibold">
                                    ${categoria.texto}
                                </span>
                                ${comunicado.urgente ? '<span class="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">Urgente</span>' : ''}
                            </div>
                            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                                ${dataFormatada}
                            </p>
                        </div>
                        <p class="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                            ${comunicado.titulo}
                        </p>
                        <p class="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                            ${comunicado.descricao}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Função para mostrar mensagem de erro
    function mostrarMensagem(mensagem) {
        gridComunicados.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 dark:text-gray-400 text-lg">${mensagem}</p>
            </div>
        `;
    }

    // Event listener para busca
    inputBusca.addEventListener('input', function (e) {
        termoBusca = e.target.value;
        renderizarComunicados();
    });

    // Event listeners para botões de categoria
    botoesCategoria.forEach((botao, index) => {
        botao.addEventListener('click', function () {
            // Remove seleção de todos os botões
            botoesCategoria.forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('bg-white', 'dark:bg-gray-800', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
                b.querySelector('p').classList.remove('text-white');
                b.querySelector('p').classList.add('text-gray-800', 'dark:text-gray-200');
            });

            // Adiciona seleção ao botão clicado
            this.classList.remove('bg-white', 'dark:bg-gray-800', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
            this.classList.add('bg-primary', 'text-white');
            this.querySelector('p').classList.remove('text-gray-800', 'dark:text-gray-200');
            this.querySelector('p').classList.add('text-white');

            // Define filtro
            const categorias = ['Todos', 'Urgente', 'Manutenção', 'Eventos', 'Informativo'];
            filtroAtual = categorias[index];

            renderizarComunicados();
        });
    });

    // Inicialização
    await carregarComunicados();
});