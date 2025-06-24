// historico.js

const API_BASE_URL_HISTORICO = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userInfoDiv = document.getElementById('userInfo');
    const logoutButton = document.getElementById('logoutButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const voltarMeusAgendamentosButton = document.getElementById('voltarMeusAgendamentosBtn');

    if (!authToken) {
        alert("Você precisa estar logado para ver seu histórico. Redirecionando para login...");
        window.location.href = '../html/login.html'; 
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
            window.location.href = '../html/login.html'; 
        });
    }
    
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', handleDeleteAccountGlobalHistorico); 
    }

    if (voltarMeusAgendamentosButton) {
        voltarMeusAgendamentosButton.addEventListener('click', () => {
            window.location.href = '../html/meus_agendamentos.html'; // Link para a página de agendamentos ativos
        });
    }

    carregarHistoricoAgendamentos();
});

// Reutilize fetchAPISecuredGlobal e handleDeleteAccountGlobal (idealmente de um utils.js)
// Por agora, vou duplicá-las aqui para manter o exemplo contido.
async function fetchAPISecuredGlobalHistorico(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers, };
    if (token) { headers['Authorization'] = `Bearer ${token}`; }
    else {
        alert("Sessão inválida ou expirada. Faça login novamente.");
        window.location.href = '../html/login.html';
        throw new Error("Token não encontrado");
    }
    try {
        const response = await fetch(`${API_BASE_URL_HISTORICO}${endpoint}`, { ...options, headers });
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken'); localStorage.removeItem('userName');
            alert("Sessão expirada ou inválida. Faça login novamente.");
            window.location.href = '../html/login.html';
            throw new Error("Não autorizado");
        }
        let responseData = null;
        if (response.status !== 204) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                responseData = await response.json().catch(e => { throw new Error("JSON inválido."); });
            } else {
                const textResponse = await response.text();
                if (!response.ok) throw new Error(textResponse || `Erro HTTP ${response.status}`);
                responseData = { message: textResponse };
            }
        }
        if (!response.ok) { throw new Error(responseData?.message || `Erro HTTP ${response.status}`); }
        return responseData;
    } catch (error) { console.error(`Erro em fetch para ${endpoint}:`, error.message); throw error; }
}

async function handleDeleteAccountGlobalHistorico() {
    const userNameForPrompt = localStorage.getItem('userName') || 'usuário';
    if (window.confirm(`ATENÇÃO, ${userNameForPrompt}!\n\nTem CERTEZA que deseja excluir sua conta permanentemente?\n\nTODOS os seus dados serão perdidos e esta ação NÃO PODE SER DESFEITA.`)) {
        const delBtn = document.getElementById('deleteAccountButton');
        const logBtn = document.getElementById('logoutButton');
        if(delBtn) delBtn.disabled = true; if(logBtn) logBtn.disabled = true;
        try {
            const result = await fetchAPISecuredGlobalHistorico('/usuarios/minha-conta', { method: 'DELETE' });
            alert(result?.message || 'Sua conta foi excluída com sucesso.');
            localStorage.removeItem('authToken'); localStorage.removeItem('userName');
            window.location.href = '../html/login.html';
        } catch (error) {
            alert(`Erro ao excluir conta: ${error.message}`);
            if(delBtn) delBtn.disabled = false; if(logBtn) logBtn.disabled = false;
        }
    }
}

async function carregarHistoricoAgendamentos() {
    const listaHistoricoDiv = document.getElementById('listaHistoricoAgendamentos');
    const loadingMessage = document.getElementById('loadingMessageHistorico');

    try {
        const agendamentos = await fetchAPISecuredGlobalHistorico('/meus-agendamentos/historico');
        if (loadingMessage) loadingMessage.style.display = 'none';
        listaHistoricoDiv.innerHTML = ''; 

        if (agendamentos && agendamentos.length > 0) {
            agendamentos.forEach(ag => {
                let displayedStatus = ag.status_agendamento;
                let statusClasseCss = ag.status_agendamento?.toLowerCase().replace(/\s+/g, '').replace('ã', 'a') || 'desconhecido';

                // Se o agendamento era 'Confirmado' ou 'Pendente', e está no histórico, consideramos 'Concluído'
                if (ag.status_agendamento === 'Confirmado' || ag.status_agendamento === 'Pendente') {
                    displayedStatus = 'Concluído';
                    statusClasseCss = 'concluido'; 
                }
                
                const dataFormatada = new Date(ag.data_agendamento).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
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
                                <button class="btn btn-sm btn-secondary" disabled title="Agendamento histórico">
                                    ${displayedStatus}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                listaHistoricoDiv.innerHTML += cardHtml;
            });
        } else {
            listaHistoricoDiv.innerHTML = '<p class="text-center col-12">Você não possui agendamentos no histórico.</p>';
        }
    } catch (error) {
        if (loadingMessage) loadingMessage.style.display = 'none';
        listaHistoricoDiv.innerHTML = `<p class="text-center col-12 text-danger">Erro ao carregar seu histórico: ${error.message}.</p>`;
        console.error("Erro ao carregar histórico de agendamentos:", error);
    }
}