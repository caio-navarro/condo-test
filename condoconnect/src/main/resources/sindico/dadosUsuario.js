document.addEventListener('DOMContentLoaded', function () {

    const nomeSindico = localStorage.getItem('nome');
    const nomeCondominio = localStorage.getItem('nomeCondominio');

    if (nomeSindico) {
        const elementosNome = document.querySelectorAll('h1.text-base.font-bold');
        elementosNome.forEach(elemento => {
            if (elemento.textContent.trim() === 'José Alves') {
                elemento.textContent = nomeSindico;
            }
        });
    }
    if (nomeCondominio) {
        const elementosCondominio = document.querySelectorAll('p');
        elementosCondominio.forEach(elemento => {
            const texto = elemento.textContent.trim();
            if (texto.includes('Condominio') || texto.includes('Condomínio')) {
                elemento.textContent = nomeCondominio;
            }
        });
    }

    console.log('Dashboard carregado com:', {
        sindico: nomeSindico || 'José Alves (padrão)',
        condominio: nomeCondominio || 'Condomínio Vila das Flores (padrão)'
    });
});