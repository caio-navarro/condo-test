// --- CONFIGURAÇÃO E UTILS ---

// Alternar visibilidade da senha
function setupPasswordToggle(inputId, toggleId, iconId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    const icon = document.getElementById(iconId);
    if (!input || !toggle || !icon) return;
    
    toggle.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        icon.classList.remove("active");
        setTimeout(() => {
            icon.textContent = isPassword ? "visibility_off" : "visibility";
            icon.classList.add("active");
        }, 80);
    });
}
setupPasswordToggle("reg-senha", "togglePassword", "iconPassword");
setupPasswordToggle("reg-confirmar-senha", "toggleConfirmPassword", "iconConfirmPassword");

// --- MÁSCARAS ---
function maskCNPJ(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 14);
    if (value.length <= 2) input.value = value;
    else if (value.length <= 5) input.value = value.replace(/(\d{2})(\d{0,3})/, '$1.$2');
    else if (value.length <= 8) input.value = value.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (value.length <= 12) input.value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
    else input.value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
}

function maskTel(input) {
    let value = input.value.replace(/\D/g, "").slice(0, 11);
    if (value.length <= 2) input.value = value.length > 0 ? `(${value}` : value;
    else if (value.length <= 6) input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    else if (value.length <= 10) input.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    else input.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
}

function maskCEP(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 8);
    if (value.length <= 5) input.value = value;
    else input.value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
}

// Aplicar máscaras nos eventos
document.getElementById('reg-cnpj')?.addEventListener('input', (e) => maskCNPJ(e.target));
document.getElementById('reg-tel')?.addEventListener('input', (e) => maskTel(e.target));
document.getElementById('reg-cep')?.addEventListener('input', (e) => maskCEP(e.target));

// --- MODAL DE MENSAGEM (ERRO/SUCESSO) ---
function mostrarModal(listaMensagens, isSuccess = false) {
    const modal = document.getElementById("erro-modal");
    const lista = document.getElementById("erro-list");
    const backdrop = document.getElementById("erro-modal-backdrop");
    const closeBtn = document.getElementById("erro-modal-close");
    const icon = document.getElementById("modal-icon");
    const title = document.getElementById("modal-title");

    if (!modal || !lista) return;

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

    const fecharModal = () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    };

    closeBtn.onclick = fecharModal;
    backdrop.onclick = fecharModal;
}

// --- VIACEP ---
const ruaInput = document.getElementById("reg-rua");
const bairroInput = document.getElementById("reg-bairro");
const cidadeInput = document.getElementById("reg-cidade");
const estadoInput = document.getElementById("reg-estado");

async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            mostrarModal(["CEP não encontrado. Verifique o número digitado."]);
            limparEndereco();
            return;
        }

        ruaInput.value = data.logradouro || "";
        bairroInput.value = data.bairro || "";
        cidadeInput.value = data.localidade || "";
        estadoInput.value = data.uf || "";
        
        // Foca no número após preencher
        document.getElementById("reg-numero").focus();

    } catch (error) {
        console.error("Erro ViaCEP:", error);
        mostrarModal(["Erro ao buscar endereço. Preencha manualmente se necessário."]);
    }
}

function limparEndereco() {
    ruaInput.value = "";
    bairroInput.value = "";
    cidadeInput.value = "";
    estadoInput.value = "";
}

document.getElementById("reg-cep")?.addEventListener("blur", (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) buscarCEP(cep);
    else limparEndereco();
});

// --- SUBMIT ---
document.getElementById("registro-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const erros = [];
    const nome = document.getElementById("reg-nome").value.trim();
    const cnpj = document.getElementById("reg-cnpj").value.replace(/\D/g, '');
    const email = document.getElementById("reg-email").value.trim();
    const telefone = document.getElementById("reg-tel").value.replace(/\D/g, '');
    const senha = document.getElementById("reg-senha").value;
    const confirmarSenha = document.getElementById("reg-confirmar-senha").value;
    
    // Validar dados básicos
    if (!nome) erros.push("Nome do condomínio é obrigatório.");
    if (cnpj.length !== 14) erros.push("CNPJ inválido (deve ter 14 dígitos).");
    if (telefone.length < 10) erros.push("Telefone inválido.");
    if (senha.length < 6) erros.push("A senha deve ter pelo menos 6 caracteres.");
    if (senha !== confirmarSenha) erros.push("As senhas não conferem.");
    
    // Validar endereço
    const cep = document.getElementById("reg-cep").value.replace(/\D/g, '');
    const numero = document.getElementById("reg-numero").value.trim();
    if (cep.length !== 8) erros.push("CEP incompleto.");
    if (!numero) erros.push("Número do endereço é obrigatório.");

    if (erros.length > 0) {
        mostrarModal(erros);
        return;
    }

    const cadastroData = {
        nome,
        cnpj,
        email,
        telefone,
        senha,
        role: "CONDOMINIO",
        endereco: {
            cep,
            rua: ruaInput.value,
            bairro: bairroInput.value,
            numero,
            cidade: cidadeInput.value,
            estado: estadoInput.value
        }
    };

    const btnSubmit = document.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.disabled = true;
    btnSubmit.innerText = "Registrando...";

    try {
        const response = await fetch("/api/condominio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cadastroData)
        });

        if (!response.ok) {
            // Tenta ler erro como JSON ou Texto
            let errorMsg = "Erro ao cadastrar condomínio.";
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
            } catch (e) {
                errorMsg = await response.text();
            }
            throw new Error(errorMsg);
        }

        // Sucesso
        mostrarModal(["Cadastro realizado com sucesso! Redirecionando para login..."], true);
        setTimeout(() => {
            window.location.href = "../pagInicial/login.html";
        }, 2000);

    } catch (error) {
        console.error("Erro no cadastro:", error);
        mostrarModal([error.message]);
        
        // Limpa senha por segurança
        document.getElementById("reg-senha").value = "";
        document.getElementById("reg-confirmar-senha").value = "";
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerText = textoOriginal;
    }
});