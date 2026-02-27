document.addEventListener('DOMContentLoaded', function () {
    const nomeCompleto = localStorage.getItem('nome');
    const cpf = localStorage.getItem('cpf');
    const id = localStorage.getItem('id');
    const nomeCondominio = localStorage.getItem('nomeCondominio');

    if (!id || !nomeCompleto) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    const primeiroNome = nomeCompleto.split(' ')[0];

    const userNameSidebar = document.querySelector('aside h2');
    if (userNameSidebar) {
        userNameSidebar.textContent = nomeCompleto;
    }

    const saudacaoDashboard = document.querySelector('main p.text-3xl, main p.text-4xl');
    if (saudacaoDashboard) {
        saudacaoDashboard.textContent = `Olá, ${primeiroNome}!`;
    }

    const tituloCondominio = document.querySelector('header h2');
    if (tituloCondominio && nomeCondominio) {
        tituloCondominio.textContent = nomeCondominio;
    }

    console.log('Usuário carregado:', {
        nome: nomeCompleto,
        primeiroNome: primeiroNome,
        cpf: cpf,
        id: id,
        condominio: nomeCondominio
    });
});