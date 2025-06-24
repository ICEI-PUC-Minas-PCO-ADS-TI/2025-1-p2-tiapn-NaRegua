// meus_agendamentos.js (Atualizado)

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userInfoDiv = document.getElementById('userInfo');
    const logoutButton = document.getElementById('logoutButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const voltarAgendarButton = document.getElementById('voltarAgendarBtn');
    const verHistoricoButton = document.getElementById('verHistoricoBtn'); // Novo botão

    if (!authToken) {
        alert("Você precisa estar logado. Redirecionando para login...");
        window.location.href = '../html/login.html'; 
        return;
    }

    if (userInfoDiv && userName) {
        userInfoDiv.textContent = `Bem-vindo(a), ${userName}!`;
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authToken'); localStorage.removeItem('userName');
            alert('Você foi desconectado.'); window.location.href = 'auth/login.html'; 
        });
    }
    
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', handleDeleteAccountGlobal); 
    }

    if (voltarAgendarButton) {
        voltarAgendarButton.addEventListener('click', () => {
            window.location.href = '../html/Agendamento.html'; // Página principal de agendamento
        });
    }

    if (verHistoricoButton) { // Evento para o novo botão
        verHistoricoButton.addEventListener('click', () => {
            window.location.href = '../html/historico.html';
        });
    }

    carregarMeusAgendamentosAtivos(); // Nome da função atualizado para clareza
});

// fetchAPISecuredGlobal e handleDeleteAccountGlobal são as mesmas do historico.js
// Idealmente, coloque-as em um arquivo utils.js e importe em ambos.
// Por simplicidade, vamos assumir que elas estão disponíveis (ou copie-as aqui também se não for usar utils.js)
async function fetchAPISecuredGlobal(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers, };
    if (token) { headers['Authorization'] = `Bearer ${token}`; }
    else {
        alert("Sessão inválida ou expirada. Faça login novamente.");
        window.location.href = '../html/login.html';
        throw new Error("Token não encontrado");
    }
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
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

async function handleDeleteAccountGlobal() {
    const userNameForPrompt = localStorage.getItem('userName') || 'usuário';
    if (window.confirm(`ATENÇÃO, ${userNameForPrompt}!\n\nTem CERTEZA que deseja excluir sua conta permanentemente?\n\nTODOS os seus dados serão perdidos e esta ação NÃO PODE SER DESFEITA.`)) {
        const delBtn = document.getElementById('deleteAccountButton');
        const logBtn = document.getElementById('logoutButton');
        if(delBtn) delBtn.disabled = true; if(logBtn) logBtn.disabled = true;
        try {
            const result = await fetchAPISecuredGlobal('/usuarios/minha-conta', { method: 'DELETE' });
            alert(result?.message || 'Sua conta foi excluída com sucesso.');
            localStorage.removeItem('authToken'); localStorage.removeItem('userName');
            window.location.href = '../html/login.html';
        } catch (error) {
            alert(`Erro ao excluir conta: ${error.message}`);
            if(delBtn) delBtn.disabled = false; if(logBtn) logBtn.disabled = false;
        }
    }
}
// Fim das funções duplicadas


async function carregarMeusAgendamentosAtivos() { // Nome atualizado
    const listaAgendamentosDiv = document.getElementById('listaAgendamentos');
    const loadingMessage = document.getElementById('loadingMessage');

    try {
        // Chama a nova rota para agendamentos ativos/futuros
        const agendamentos = await fetchAPISecuredGlobal('/meus-agendamentos/ativos'); 
        if (loadingMessage) loadingMessage.style.display = 'none';
        listaAgendamentosDiv.innerHTML = ''; 

        if (agendamentos && agendamentos.length > 0) {
            agendamentos.forEach(ag => {
                const dataAgendamentoObj = new Date(ag.data_agendamento + 'T' + ag.hora_agendamento);
                const agora = new Date();
                
                // Para agendamentos ativos, o status é o que vem do banco.
                // A lógica de "Concluído" foi movida para a página de histórico.
                let displayedStatus = ag.status_agendamento;
                let statusClasseCss = ag.status_agendamento?.toLowerCase().replace(/\s+/g, '').replace('ã', 'a') || 'desconhecido';

                let podeCancelar = true;
                let textoBotaoCancelar = 'Cancelar Agendamento';

                // Regras para desabilitar cancelamento em agendamentos ativos:
                // (Você pode adicionar regras como "não pode cancelar X horas antes")
                if (dataAgendamentoObj < agora || // Se, por algum motivo, um agendamento passado veio (não deveria com a API /ativos)
                    ['Cancelado', 'Finalizado', 'Não Compareceu'].includes(ag.status_agendamento)) {
                    podeCancelar = false;
                    textoBotaoCancelar = ag.status_agendamento; // Mostra o status atual se não cancelável
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
                    button.addEventListener('click', handleCancelarAgendamentoAtivo); // Nome da função para clareza
                }
            });

        } else {
            listaAgendamentosDiv.innerHTML = '<p class="text-center col-12">Você não possui próximos agendamentos.</p>';
        }
    } catch (error) {
        if (loadingMessage) loadingMessage.style.display = 'none';
        listaAgendamentosDiv.innerHTML = `<p class="text-center col-12 text-danger">Erro ao carregar seus próximos agendamentos: ${error.message}.</p>`;
        console.error("Erro ao carregar agendamentos ativos:", error);
    }
}

async function handleCancelarAgendamentoAtivo(event) { // Nome atualizado
    const agendamentoId = event.target.dataset.id;
    const confirmCancel = window.confirm("Tem certeza que deseja cancelar este agendamento?");

    if (confirmCancel) {
        event.target.disabled = true;
        event.target.textContent = 'Cancelando...';
        try {
            await fetchAPISecuredGlobal(`/agendamentos/${agendamentoId}`, { method: 'DELETE' });
            alert("Agendamento cancelado com sucesso!");
            carregarMeusAgendamentosAtivos(); 
        } catch (error) {
            alert(`Erro ao cancelar agendamento: ${error.message}`);
            carregarMeusAgendamentosAtivos(); 
        }
    }
}