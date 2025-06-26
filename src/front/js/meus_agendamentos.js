// src/front/js/meus_agendamentos.js

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userMenuContainer = document.getElementById('userMenuContainer');

    if (!authToken) {
        alert("Você precisa estar logado. Redirecionando para login...");
        window.location.href = '../html/login.html';
        return;
    }

    if (userMenuContainer && userName) {
        const userDropdownToggle = userMenuContainer.querySelector('#navbarUserDropdown');
        const logoutButton = userMenuContainer.querySelector('#logoutButton');
        const deleteAccountButton = userMenuContainer.querySelector('#deleteAccountButton');
        if (userDropdownToggle) userDropdownToggle.textContent = `Olá, ${userName}`;
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);
        if (deleteAccountButton) deleteAccountButton.addEventListener('click', handleDeleteAccount);
    }

    const verHistoricoButton = document.getElementById('verHistoricoBtn');
    const voltarAgendarButton = document.getElementById('voltarAgendarBtn');
    if (verHistoricoButton) verHistoricoButton.addEventListener('click', () => { window.location.href = '../html/historico.html'; });
    if (voltarAgendarButton) voltarAgendarButton.addEventListener('click', () => { window.location.href = '../html/Agendamento.html'; });

    carregarMeusAgendamentosAtivos();
});

async function carregarMeusAgendamentosAtivos() {
    const listaAgendamentosDiv = document.getElementById('listaAgendamentos');
    const loadingMessage = document.getElementById('loadingMessage');

    try {
        const agendamentos = await fetchAPISecured('/meus-agendamentos/ativos');

        // CORREÇÃO: Remove explicitamente a mensagem de carregamento do DOM
        if (loadingMessage) {
            loadingMessage.remove();
        }

        if (agendamentos && agendamentos.length > 0) {
            // Limpa o container caso já tenha alguma mensagem de erro/vazio
            listaAgendamentosDiv.innerHTML = '';
            agendamentos.forEach(ag => {
                const dataAgendamentoObj = new Date(`${ag.data_agendamento}T${ag.hora_agendamento}`);
                let podeCancelar = new Date() < dataAgendamentoObj;

                const dataFormatada = dataAgendamentoObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                const horaFormatada = dataAgendamentoObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const precoFormatado = ag.preco_servico ? parseFloat(ag.preco_servico).toFixed(2).replace('.', ',') : 'N/A';
                const statusClasse = ag.status_agendamento?.toLowerCase().replace(/\s+/g, '') || 'desconhecido';

                const cardWrapper = document.createElement('div');
                cardWrapper.className = 'col-12 col-md-6 col-lg-4';
                cardWrapper.innerHTML = `
                    <div class="card h-100">
                        <div class="card-header">${ag.nome_servico}</div>
                        <div class="card-body">
                            <h5 class="card-title">${ag.nome_barbeiro}</h5>
                            <p class="card-text"><strong>Data:</strong> ${dataFormatada}</p>
                            <p class="card-text"><strong>Hora:</strong> ${horaFormatada}</p>
                            <p class="card-text"><strong>Status:</strong> <span class="status-badge status-${statusClasse}">${ag.status_agendamento}</span></p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0 text-center py-3">
                            <button class="btn btn-sm btn-danger btn-cancelar-agendamento" data-id="${ag.id}" ${!podeCancelar ? 'disabled' : ''}>
                                ${podeCancelar ? 'Cancelar' : 'Não cancelável'}
                            </button>
                        </div>
                    </div>
                `;
                listaAgendamentosDiv.appendChild(cardWrapper);
            });

            document.querySelectorAll('.btn-cancelar-agendamento:not([disabled])').forEach(button => {
                button.addEventListener('click', handleCancelarAgendamento);
            });
        } else {
            // Exibe a mensagem se não houver agendamentos
            listaAgendamentosDiv.innerHTML = '<p class="text-center col-12">Você não possui próximos agendamentos.</p>';
        }
    } catch (error) {
        // Garante que a mensagem de carregamento seja removida também em caso de erro
        if (loadingMessage) {
            loadingMessage.remove();
        }
        listaAgendamentosDiv.innerHTML = `<p class="text-center col-12 text-danger">Erro ao carregar seus agendamentos.</p>`;
    }
}

async function handleCancelarAgendamento(event) {
    const agendamentoId = event.target.dataset.id;
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
        event.target.disabled = true;
        event.target.textContent = 'Cancelando...';
        try {
            await fetchAPISecured(`/agendamentos/${agendamentoId}`, { method: 'DELETE' });
            alert("Agendamento cancelado com sucesso!");
            carregarMeusAgendamentosAtivos();
        } catch (error) {
            alert(`Erro ao cancelar agendamento: ${error.message}`);
            carregarMeusAgendamentosAtivos();
        }
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