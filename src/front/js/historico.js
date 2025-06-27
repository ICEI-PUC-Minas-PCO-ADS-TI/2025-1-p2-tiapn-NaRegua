// src/front/js/historico.js

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userMenuContainer = document.getElementById('userMenuContainer');

    if (!authToken) { window.location.href = '../html/login.html'; return; }

    if (userMenuContainer && userName) {
        const userDropdownToggle = userMenuContainer.querySelector('#navbarUserDropdown');
        const logoutButton = userMenuContainer.querySelector('#logoutButton');
        const deleteAccountButton = userMenuContainer.querySelector('#deleteAccountButton');
        if (userDropdownToggle) userDropdownToggle.textContent = `Olá, ${userName}`;
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);
        if (deleteAccountButton) deleteAccountButton.addEventListener('click', handleDeleteAccount);
    }

    const voltarMeusAgendamentosButton = document.getElementById('voltarMeusAgendamentosBtn');
    if (voltarMeusAgendamentosButton) {
        voltarMeusAgendamentosButton.addEventListener('click', () => {
            window.location.href = '../html/meus_agendamentos.html';
        });
    }

    carregarHistoricoAgendamentos();
});

async function carregarHistoricoAgendamentos() {
    const listaHistoricoDiv = document.getElementById('listaHistoricoAgendamentos');
    const loadingMessage = document.getElementById('loadingMessageHistorico');

    try {
        const agendamentos = await fetchAPISecured('/meus-agendamentos/historico');

        // CORREÇÃO: Remove explicitamente a mensagem de carregamento do DOM
        if (loadingMessage) {
            loadingMessage.remove();
        }

        if (agendamentos && agendamentos.length > 0) {
            // Limpa o container caso já tenha alguma mensagem de erro/vazio
            listaHistoricoDiv.innerHTML = '';
            agendamentos.forEach(ag => {
                let displayedStatus = ag.status_agendamento;
                let statusClasseCss = ag.status_agendamento?.toLowerCase().replace(/\s+/g, '').replace('ã', 'a') || 'desconhecido';

                if (ag.status_agendamento === 'Confirmado' || ag.status_agendamento === 'Pendente') {
                    displayedStatus = 'Concluído';
                    statusClasseCss = 'concluido';
                }

                const dataFormatada = new Date(ag.data_agendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                const horaFormatada = ag.hora_agendamento.substring(0, 5);

                const cardWrapper = document.createElement('div');
                cardWrapper.className = 'col-12 col-md-6 col-lg-4';
                cardWrapper.innerHTML = `
                    <div class="card h-100">
                        <div class="card-header">${ag.nome_servico}</div>
                        <div class="card-body">
                            <h5 class="card-title">${ag.nome_barbeiro}</h5>
                            <p class="card-text"><strong>Data:</strong> ${dataFormatada}</p>
                            <p class="card-text"><strong>Hora:</strong> ${horaFormatada}</p>
                            <p class="card-text"><strong>Status:</strong> <span class="status-badge status-${statusClasseCss}">${displayedStatus}</span></p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0 text-center py-3">
                            <button class="btn btn-sm btn-secondary" disabled>${displayedStatus}</button>
                        </div>
                    </div>
                `;
                listaHistoricoDiv.appendChild(cardWrapper);
            });
        } else {
            // Exibe a mensagem se não houver histórico
            listaHistoricoDiv.innerHTML = '<p class="text-center col-12">Você não possui agendamentos no histórico.</p>';
        }
    } catch (error) {
        // Garante que a mensagem de carregamento seja removida também em caso de erro
        if (loadingMessage) {
            loadingMessage.remove();
        }
        listaHistoricoDiv.innerHTML = `<p class="text-center col-12 text-danger">Erro ao carregar seu histórico.</p>`;
    }
}

// === FUNÇÕES GLOBAIS (Idealmente em um utils.js) ===
function handleLogout() {
    localStorage.clear();
    alert('Você foi desconectado.');
    window.location.href = '../html/login.html';
}

async function handleDeleteAccount() {
    if (window.confirm("ATENÇÃO!\n\nVocê tem CERTEZA que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.")) {
        try {
            await fetchAPISecured('/usuarios/minha-conta', { method: 'DELETE' });
            alert('Sua conta foi excluída com sucesso.');
            handleLogout();
        } catch (error) {
            alert(`Erro ao excluir conta: ${error.message}`);
        }
    }
}

async function fetchAPISecured(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) { headers['Authorization'] = `Bearer ${token}`; }
    else { window.location.href = '../html/login.html'; throw new Error("Token não encontrado"); }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) handleLogout();
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message);
        }
        return response.status === 204 ? null : await response.json();
    } catch (error) { console.error(`Erro na API: ${error.message}`); throw error; }
}