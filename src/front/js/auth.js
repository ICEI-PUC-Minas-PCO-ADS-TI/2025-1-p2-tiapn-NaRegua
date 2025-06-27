// src/front/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DA ANIMAÇÃO DO PAINEL LOGIN/CADASTRO ---
    const container = document.querySelector('.container');
    if (container) {
        const registerBtn = document.querySelector('.register-btn');
        const loginBtn = document.querySelector('.login-btn');

        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                container.classList.add('active');
            });
        }
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                container.classList.remove('active');
            });
        }
    }

    // --- LÓGICA DOS FORMULÁRIOS DE AUTENTICAÇÃO ---
    const API_BASE_URL = 'http://localhost:3000/api/usuarios';

    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const recuperarSenhaForm = document.getElementById('recuperarSenhaForm');

    // Event Listener para LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usuario = document.getElementById('loginUsuario').value.trim();
            const senha = document.getElementById('loginSenha').value.trim();

            if (!usuario || !senha) {
                return alert('Por favor, preencha usuário e senha.');
            }

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, senha })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Erro HTTP ${response.status}`);
                }

                // Salva os dados no localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('isAdmin', data.isAdmin);

                alert(`Login bem-sucedido! Bem-vindo, ${data.userName}!`);

                // Redirecionamento condicional para admin ou usuário comum
                if (data.isAdmin) {
                    window.location.href = '../html/adm-panel.html';
                } else {
                    window.location.href = '../html/Agendamento.html';
                }
            } catch (error) {
                alert(`Falha no login: ${error.message}`);
                console.error('Erro no login:', error);
            }
        });
    }

    // Event Listener para CADASTRO
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('cadastroNome').value.trim();
            const cpf = document.getElementById('cadastroCpf').value.trim();
            const email = document.getElementById('cadastroEmail').value.trim();
            const senha = document.getElementById('cadastroSenha').value.trim();
            const confirmarSenha = document.getElementById('cadastroConfirmarSenha').value.trim();

            if (!nome || !cpf || !email || !senha) {
                return alert('Por favor, preencha todos os campos: Nome, CPF, Email e Senha.');
            }
            if (senha !== confirmarSenha) {
                return alert('As senhas não coincidem.');
            }

            try {
                const payload = { nome, cpf, email, senha };

                const response = await fetch(`${API_BASE_URL}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Erro HTTP ${response.status}`);
                }

                alert(data.message || 'Cadastro realizado com sucesso! Por favor, faça o login.');

                if (container) container.classList.remove('active');
                if (loginForm) loginForm.reset();
                cadastroForm.reset();

            } catch (error) {
                alert(`Falha no cadastro: ${error.message}`);
                console.error('Erro no cadastro:', error);
            }
        });
    }

    // Event Listener para RECUPERAR SENHA
    if (recuperarSenhaForm) {
        recuperarSenhaForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const CPF = document.getElementById('recuperarCpf').value.trim();
            const novaSenha = document.getElementById('recuperarNovaSenha').value.trim();

            if (!CPF || !novaSenha) {
                return alert('Por favor, preencha CPF e a nova senha.');
            }

            try {
                const response = await fetch(`${API_BASE_URL}/recuperar-senha`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ CPF, novaSenha })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Erro HTTP ${response.status}`);
                }

                alert(data.message || 'Senha alterada com sucesso!');
                window.location.href = '../html/login.html';
            } catch (error) {
                alert(`Falha ao recuperar senha: ${error.message}`);
                console.error('Erro ao recuperar senha:', error);
            }
        });
    }
});