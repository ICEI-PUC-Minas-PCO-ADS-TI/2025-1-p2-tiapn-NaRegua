// meus_agendamentos.js

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userInfoDiv = document.getElementById('userInfo');
    const logoutButton = document.getElementById('logoutButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const voltarAgendarButton = document.getElementById('voltarAgendarBtn');

    if (!authToken) {
        alert("Você precisa estar logado para ver seus agendamentos. Redirecionando para login...");
        window.location.href = 'auth/login.html';
        return;
    }

    if (userInfoDiv && userName) {
        userInfoDiv.textContent = `Bem-vindo(a), ${userName}!`;
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            alert('Você foi desconectado.');
            window.location.href = 'auth/login.html';
        });
    }

    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', handleDeleteAccountGlobal);
    }

    if (voltarAgendarButton) {
        voltarAgendarButton.addEventListener('click', () => {
            window.location.href = 'Agendamento.html';
        });
    }

    carregarMeusAgendamentos();
});

async function fetchAPISecuredGlobal(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        alert("Sessão inválida ou expirada. Faça login novamente.");
        window.location.href = 'auth/login.html';
        throw new Error("Token não encontrado para requisição segura");
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            alert("Sessão expirada ou inválida. Faça login novamente.");
            window.location.href = 'auth/login.html';
            throw new Error("Não autorizado");
        }

        let responseData = null;
        if (response.status !== 204) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                responseData = await response.json().catch(e => {
                    console.error("Erro ao parsear JSON:", e);
                    throw new Error("Resposta do servidor não é JSON válido.");
                });
            } else {
                const textResponse = await response.text();
                if (!response.ok) throw new Error(textResponse || `Erro HTTP ${response.status}`);
                responseData = { message: textResponse };
            }
        }

        if (!response.ok) {
            throw new Error(responseData?.message || `Erro HTTP ${response.status}`);
        }
        return responseData;
    } catch (error) {
        console.error(`Erro em fetchAPISecuredGlobal para ${endpoint}:`, error.message);
        throw error;
    }
}

async function handleDeleteAccountGlobal() {
    const userNameForPrompt = localStorage.getItem('userName') || 'usuário';
    const confirmDelete = window.confirm(
        `ATENÇÃO, ${userNameForPrompt}!\n\n` +
        `Você tem CERTEZA que deseja excluir sua conta permanentemente?\n\n` +
        `TODOS os seus dados, incluindo agendamentos, serão perdidos e esta ação NÃO PODE SER DESFEITA.`
    );

    if (confirmDelete) {
        const delBtn = document.getElementById('deleteAccountButton');
        const logBtn = document.getElementById('logoutButton');
        if (delBtn) delBtn.disabled = true;
        if (logBtn) logBtn.disabled = true;
        try {
            const result = await fetchAPISecuredGlobal('/usuarios/minha-conta', { method: 'DELETE' });
            alert(result?.message || 'Sua conta foi excluída com sucesso.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            window.location.href = 'auth/login.html';
        } catch (error) {
            alert(`Erro ao excluir conta: ${error.message}`);
            if (delBtn) delBtn.disabled = false;
            if (logBtn) logBtn.disabled = false;
        }
    }
}

async function carregarMeusAgendamentos() {
    const listaAgendamentosDiv = document.getElementById('listaAgendamentos');
    const loadingMessageParaAgendamentos = document.getElementById('loadingMessage');

    try {
        const agendamentos = await fetchAPISecuredGlobal('/meus-agendamentos');
        if (loadingMessageParaAgendamentos) loadingMessageParaAgendamentos.style.display = 'none';
        listaAgendamentosDiv.innerHTML = '';

        if (agendamentos && agendamentos.length > 0) {
            agendamentos.forEach(ag => {
                const dataAgendamentoObj = new Date(ag.data_agendamento + 'T' + ag.hora_agendamento);
                const agora = new Date();

                let displayedStatus = ag.status_agendamento;
                let statusClasseCss = ag.status_agendamento?.toLowerCase().replace(/\s+/g, '').replace('ã', 'a') || 'desconhecido';

                // Se o agendamento era 'Confirmado' ou 'Pendente' e já passou, mostre como 'Concluído'
                if ((ag.status_agendamento === 'Confirmado' || ag.status_agendamento === 'Pendente') && dataAgendamentoObj < agora) {
                    displayedStatus = 'Concluído';
                    statusClasseCss = 'concluido'; // Usará o estilo .status-concluido
                }

                let podeCancelar = true;
                let textoBotaoCancelar = 'Cancelar Agendamento';

                // Não pode cancelar se:
                // 1. O horário do agendamento já passou.
                // 2. O status original já é terminal (Cancelado, Finalizado, Não Compareceu)
                // 3. O status que estamos exibindo é 'Concluído' (porque já passou)
                if (dataAgendamentoObj < agora ||
                    ['Cancelado', 'Finalizado', 'Não Compareceu'].includes(ag.status_agendamento) ||
                    displayedStatus === 'Concluído'
                ) {
                    podeCancelar = false;
                    // Define o texto do botão desabilitado com base no status
                    if (displayedStatus === 'Cancelado' || displayedStatus === 'Concluído' || displayedStatus === 'Finalizado' || displayedStatus === 'Não Compareceu') {
                        textoBotaoCancelar = displayedStatus;
                    } else if (dataAgendamentoObj < agora) { // Se passou e não tinha status terminal, consideramos concluído para o botão
                        textoBotaoCancelar = 'Concluído';
                    }
                    else {
                        textoBotaoCancelar = 'Não Cancelável';
                    }
                }

                const dataFormatada = new Date(ag.data_agendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                const horaFormatada = ag.hora_agendamento.substring(0, 5);
                const precoFormatado = ag.preco_servico ? parseFloat(ag.preco_servico).toFixed(2) : 'N/A';

                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="card">
                            <div class="card-header">
                                ${ag.nome_servico}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${ag.nome_barbeiro}</h5>
                                <p class="card-text"><strong>Data:</strong> ${dataFormatada}</p>
                                <p class="card-text"><strong>Hora:</strong> ${horaFormatada}</p>
                                <p class="card-text"><strong>Duração:</strong> ${ag.duracao_minutos} min</p>
                                <p class="card-text"><strong>Preço:</strong> R$ ${precoFormatado}</p>
                                <p class="card-text"><strong>Status:</strong> <span class="status-badge status-${statusClasseCss}">${displayedStatus}</span></p>
                                ${ag.observacoes ? `<p class="card-text"><strong>Observações:</strong> ${ag.observacoes}</p>` : ''}
                            </div>
                            <div class="card-footer bg-transparent border-top-0 text-center py-3">
                                <button class="btn btn-sm btn-cancelar-agendamento" 
                                        data-id="${ag.id}" 
                                        ${!podeCancelar ? `disabled title="${textoBotaoCancelar}"` : ''}>
                                    ${textoBotaoCancelar}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                listaAgendamentosDiv.innerHTML += cardHtml;
            });

            document.querySelectorAll('.btn-cancelar-agendamento').forEach(button => {
                if (!button.disabled) {
                    button.addEventListener('click', handleCancelarAgendamento);
                }
            });

        } else {
            listaAgendamentosDiv.innerHTML = '<p class="text-center col-12">Você ainda não possui agendamentos.</p>';
        }
    } catch (error) {
        if (loadingMessageParaAgendamentos) loadingMessageParaAgendamentos.style.display = 'none';
        listaAgendamentosDiv.innerHTML = `<p class="text-center col-12 text-danger">Erro ao carregar seus agendamentos: ${error.message}.</p>`;
        console.error("Erro ao carregar agendamentos:", error);
    }
}

async function handleCancelarAgendamento(event) {
    const agendamentoId = event.target.dataset.id;
    const confirmCancel = window.confirm("Tem certeza que deseja cancelar este agendamento?");

    if (confirmCancel) {
        event.target.disabled = true;
        event.target.textContent = 'Cancelando...';
        try {
            await fetchAPISecuredGlobal(`/agendamentos/${agendamentoId}`, { method: 'DELETE' });
            alert("Agendamento cancelado com sucesso!");
            carregarMeusAgendamentos();
        } catch (error) {
            alert(`Erro ao cancelar agendamento: ${error.message}`);
            carregarMeusAgendamentos();
        }
    }
}