// src/front/script.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('body.body-login .form-container form');
    const cadastroForm = document.querySelector('body.body-cadastro .form-container form');
    const recuperarSenhaForm = document.querySelector('body.body-recuperar-senha .form-container form');

    const API_BASE_URL = 'http://localhost:3000/api/usuarios'; // URL COMPLETA do backend

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userInput = loginForm.querySelector('input[placeholder="Usuário (Email ou CPF)"]');
            const senhaInput = loginForm.querySelector('input[type="password"]');

            const usuario = userInput ? userInput.value : '';
            const senha = senhaInput ? senhaInput.value : '';

            if (!usuario || !senha) {
                alert('Por favor, preencha usuário e senha.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, senha })
                });

                let data;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                }

                if (!response.ok) {
                    throw new Error(data ? data.message : response.statusText || `Erro HTTP ${response.status}`);
                }

                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userName', data.userName);
                alert(`Login bem-sucedido! Bem-vindo, ${data.userName}!`);
                window.location.href = '../Agendamento.html'; // Ajuste se Agendamento.html estiver em outra pasta
            } catch (error) {
                alert(`Falha no login: ${error.message}`);
                console.error('Erro no login:', error);
            }
        });
    }

    // CADASTRO (com telefone)
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nomeInput = document.getElementById('cadastroNome');
            const cpfInput = document.getElementById('cadastroCpf');
            const emailInput = document.getElementById('cadastroEmail');
            const telefoneInput = document.getElementById('cadastroTelefone'); // Campo de telefone
            const senhaInput = document.getElementById('cadastroSenha');
            const confirmarSenhaInput = document.getElementById('cadastroConfirmarSenha');

            const nome = nomeInput ? nomeInput.value : '';
            const cpf = cpfInput ? cpfInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const telefone = telefoneInput ? telefoneInput.value : ''; // Coleta o telefone
            const senha = senhaInput ? senhaInput.value : '';
            const confirmarSenha = confirmarSenhaInput ? confirmarSenhaInput.value : '';

            if (!nome || (!cpf && !email) || !senha) {
                alert('Por favor, preencha nome, (CPF ou Email) e senha.');
                return;
            }
            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem.');
                return;
            }

            try {
                const payload = { nome, senha };
                if (cpf) payload.cpf = cpf;
                if (email) payload.email = email;
                if (telefone) payload.telefone = telefone; // Adiciona telefone ao payload

                const response = await fetch(`${API_BASE_URL}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                let data;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                }

                if (!response.ok) {
                    throw new Error(data ? data.message : response.statusText || `Erro HTTP ${response.status}`);
                }

                alert(data.message || 'Cadastro realizado com sucesso!');
                window.location.href = 'login.html'; // Redireciona para login após cadastro
            } catch (error) {
                alert(`Falha no cadastro: ${error.message}`);
                console.error('Erro no cadastro:', error);
            }
        });
    }

    // RECUPERAR SENHA
    if (recuperarSenhaForm) {
        recuperarSenhaForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cpfInput = document.getElementById('CPF'); // Usando ID do seu HTML original
            const novaSenhaInput = document.getElementById('novaSenha'); // Usando ID do seu HTML original

            const CPF = cpfInput ? cpfInput.value : '';
            const novaSenha = novaSenhaInput ? novaSenhaInput.value : '';

            if (!CPF || !novaSenha) {
                alert('Por favor, preencha CPF e a nova senha.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/recuperar-senha`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ CPF, novaSenha })
                });

                let data;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                }

                if (!response.ok) {
                    throw new Error(data ? data.message : response.statusText || `Erro HTTP ${response.status}`);
                }

                alert(data.message || 'Senha alterada com sucesso!');
                window.location.href = 'login.html';
            } catch (error) {
                alert(`Falha ao recuperar senha: ${error.message}`);
                console.error('Erro ao recuperar senha:', error);
            }
        });
    }
});