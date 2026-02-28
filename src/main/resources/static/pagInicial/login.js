// Limpa localStorage ao carregar a página de login
localStorage.clear();

document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value;

    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        if (!res.ok) {
            alert("Login inválido.");
            return;
        }

        const usuario = await res.json();

        // ---------- DADOS BÁSICOS ----------
        localStorage.setItem("id", usuario.id);
        localStorage.setItem("nome", usuario.nome);
        localStorage.setItem("email", usuario.email);
        localStorage.setItem("cpf", usuario.cpf);
        localStorage.setItem("role", usuario.role);
        localStorage.setItem("statusUsuario", usuario.statusUsuario);

        // ---------- CONDOMÍNIO ----------
        if (usuario.condominio) {
            if (usuario.condominio.id) {
                localStorage.setItem("idCondominio", usuario.condominio.id);
            }
            if (usuario.condominio.codigo) {
                localStorage.setItem("codCondominio", usuario.condominio.codigo);
            }
            localStorage.setItem("nomeCondominio", usuario.condominio.nome || "");
        }

        // ---------- ENDEREÇO ----------
        if (usuario.endereco) {
            localStorage.setItem('endereco', JSON.stringify(usuario.endereco));
        }

        const enderecoSalvo = localStorage.getItem('endereco');
        const temEndereco = enderecoSalvo && JSON.parse(enderecoSalvo).rua && JSON.parse(enderecoSalvo).numero;

        console.log("Usuário logado:", {
            id: usuario.id,
            nome: usuario.nome,
            role: usuario.role,
            status: usuario.statusUsuario,
            temEndereco,
            condominio: usuario.condominio || null
        });

        // ---------- MORADOR ----------
        if (usuario.role === "MORADOR") {
            if (usuario.statusUsuario === "PENDENTE" || usuario.statusUsuario === "INATIVO") {
                window.location.href = "../pagInicial/pedidoPendente.html";
                return;
            }

            if (!temEndereco) {
                window.location.href = "../morador/completarEndereco.html";
                return;
            }

            window.location.href = "../morador/dashboard.html";
            return;
        }

        // ---------- SÍNDICO ----------
        if (usuario.role === "SINDICO") {
            if (usuario.statusUsuario === "PENDENTE" || usuario.statusUsuario === "INATIVO") {
                window.location.href = "../pagInicial/pedidoPendente.html";
                return;
            }

            window.location.href = "../sindico/dashboard.html";
            return;
        }

        // ---------- CONDOMÍNIO ----------
        if (usuario.role === "CONDOMINIO") {
            window.location.href = "../condominio/dashboard.html";
            return;
        }

        // ---------- FALLBACK ----------
        alert("Tipo de usuário não reconhecido.");

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao conectar ao servidor. Verifique sua conexão.");
    }
});