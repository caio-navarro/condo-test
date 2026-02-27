// --- CONFIGURAÇÃO E UTILS ---

// Toggle Senha
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
function maskCPF(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 11);
    if (value.length <= 3) input.value = value;
    else if (value.length <= 6) input.value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    else if (value.length <= 9) input.value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else input.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
}

function maskTel(input) {
    let value = input.value.replace(/\D/g, "").slice(0, 11);
    if (value.length <= 2) input.value = value.length > 0 ? `(${value}` : value;
    else if (value.length <= 6) input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    else if (value.length <= 10) input.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    else input.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
}

document.getElementById('reg-cpf')?.addEventListener('input', (e) => maskCPF(e.target));
document.getElementById('reg-tel')?.addEventListener('input', (e) => maskTel(e.target));


// --- MODAL DE MENSAGEM ---
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

// --- SUBMIT DO FORMULÁRIO ---
document.getElementById("registro-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const erros = [];
    const nome = document.getElementById("reg-nome").value.trim();
    const cpf = document.getElementById("reg-cpf").value.replace(/\D/g, '');
    const email = document.getElementById("reg-email").value.trim();
    const telefone = document.getElementById("reg-tel").value.replace(/\D/g, '');
    const senha = document.getElementById("reg-senha").value;
    const confirmarSenha = document.getElementById("reg-confirmar-senha").value;
    const codigoCondominio = document.getElementById("codigo-cond").value.trim();

    // Validações
    if (!nome) erros.push("Nome é obrigatório.");
    if (cpf.length !== 11) erros.push("CPF incompleto (11 dígitos).");
    if (!email) erros.push("E-mail é obrigatório.");
    if (telefone.length < 10) erros.push("Telefone incompleto.");
    if (senha.length < 6) erros.push("A senha deve ter pelo menos 6 caracteres.");
    if (senha !== confirmarSenha) erros.push("As senhas não conferem.");
    if (!codigoCondominio) erros.push("Código do condomínio é obrigatório.");

    if (erros.length > 0) {
        mostrarModal(erros);
        return;
    }

    const cadastroData = {
        nome,
        cpf,
        email,
        telefone,
        senha,
        codigoCondominio
    };

    const btnSubmit = document.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.disabled = true;
    btnSubmit.innerText = "Registrando...";

    try {
        const response = await fetch("http://localhost:8080/sindico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cadastroData)
        });

        if (!response.ok) {
            let errorMsg = "Erro ao cadastrar síndico.";
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
            } catch (e) {
                errorMsg = await response.text();
            }
            throw new Error(errorMsg);
        }

        // Sucesso - Modal Verde
        mostrarModal(["Cadastro realizado com sucesso! Aguardando aprovação..."], true);
        
        setTimeout(() => {
            window.location.href = "../pagInicial/pedidoPendente.html";
        }, 2000);

    } catch (error) {
        console.error("Erro no cadastro:", error);
        mostrarModal([error.message]);
        
        document.getElementById("reg-senha").value = "";
        document.getElementById("reg-confirmar-senha").value = "";
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerText = textoOriginal;
    }
});