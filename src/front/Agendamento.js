// src/front/Agendamento.js

const API_URL = 'http://localhost:3000/api'; // URL base COMPLETA da API
let currentStep = 1;
let agendamentoData = {
  barbeiroId: null, servicoId: null, data: null, horario: null,
  barbeiroNome: null, servicoNome: null
};

// --- ELEMENTOS DO DOM (Agendamento) ---
let barbeiroSelect, corteSelect, horarioSelect, dataSelecionadaInput;
let daysContainer, monthYearHeader, prevMonthButton, nextMonthButton;
let modalElement, modalInstanceBootstrap;
let btnVoltar, btnProximo;
let userInfoDiv, logoutBtn, deleteAccountBtn; // Adicionado deleteAccountBtn

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente carregado e parseado.");

  const authToken = localStorage.getItem('authToken');
  const userName = localStorage.getItem('userName');

  userInfoDiv = document.getElementById('userInfo');
  logoutBtn = document.getElementById('logoutButton');
  deleteAccountBtn = document.getElementById('deleteAccountButton'); // Seleciona o novo botão

  if (!authToken) {
    console.log("Nenhum token de autenticação encontrado. Redirecionando para login...");
    alert("Você precisa estar logado para acessar esta página. Redirecionando para login...");
    window.location.href = 'auth/login.html'; // Ajuste o caminho conforme sua estrutura
    return;
  }
  console.log("Token de autenticação encontrado:", authToken);

  if (userInfoDiv && userName) {
    userInfoDiv.textContent = `Bem-vindo(a), ${userName}!`;
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      alert('Você foi desconectado.');
      window.location.href = 'auth/login.html'; // Ajuste o caminho
    });
  }

  // Event listener para o botão de excluir conta
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', handleDeleteAccount);
  }

  // Seletores do Modal de Agendamento
  barbeiroSelect = document.getElementById('barbeiroSelect');
  corteSelect = document.getElementById('corteSelect');
  horarioSelect = document.getElementById('horarioSelect');
  dataSelecionadaInput = document.getElementById('dataSelecionada');
  daysContainer = document.getElementById("days");
  monthYearHeader = document.getElementById("monthYear");
  prevMonthButton = document.getElementById("prev");
  nextMonthButton = document.getElementById("next");
  btnVoltar = document.getElementById('btnVoltar');
  btnProximo = document.getElementById('btnProximo');
  modalElement = document.getElementById('staticBackdrop');

  if (modalElement) {
    modalInstanceBootstrap = bootstrap.Modal.getOrCreateInstance(modalElement);
  }

  if (barbeiroSelect) carregarBarbeiros();
  if (corteSelect) carregarServicos();
  if (daysContainer) initializeCalendar();

  if (modalElement) {
    showStep(currentStep);
    updateButtonVisibility();
    modalElement.addEventListener('hidden.bs.modal', resetModal);
  } else {
    console.warn("Elemento do modal principal (staticBackdrop) não encontrado.");
  }

  if (barbeiroSelect) barbeiroSelect.addEventListener('change', handleSelecaoPrincipal);
  if (corteSelect) corteSelect.addEventListener('change', handleSelecaoPrincipal);
});

async function fetchAPISecured(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn("Tentando fazer requisição segura sem token.");
    // Redirecionar para login se não houver token e a requisição for sensível
    alert("Sua sessão pode ter expirado. Por favor, faça login novamente.");
    window.location.href = 'auth/login.html';
    throw new Error("Token não encontrado para requisição segura");
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      alert("Sua sessão expirou ou é inválida. Por favor, faça login novamente.");
      window.location.href = 'auth/login.html';
      throw new Error("Não autorizado");
    }

    let responseData = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json().catch(e => {
        console.error("Erro ao parsear JSON da resposta:", e);
        throw new Error("Resposta do servidor não é JSON válido, mesmo com content-type JSON.");
      });
    } else {
      const textResponse = await response.text();
      if (!response.ok) throw new Error(textResponse || `Erro HTTP ${response.status}`);
      // Se não for JSON e OK, pode não haver dados a retornar ou pode ser um 204 No Content
      // Se for 204, responseData permanecerá null, o que é esperado.
    }

    if (!response.ok) {
      // Prioriza a mensagem do JSON, se houver
      throw new Error(responseData && responseData.message ? responseData.message : `Erro HTTP ${response.status}`);
    }
    return responseData;
  } catch (error) {
    console.error(`Erro em fetchAPISecured para ${endpoint}:`, error.message);
    if (error.message !== "Não autorizado" && error.message !== "Token não encontrado para requisição segura") {
      alert(`Erro na comunicação (segura): ${error.message}`);
    }
    throw error;
  }
}

async function fetchAPIPublic(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    let responseData = null;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json().catch(e => {
        console.error("Erro ao parsear JSON da resposta pública:", e);
        throw new Error("Resposta do servidor (pública) não é JSON válido.");
      });
    } else {
      const textResponse = await response.text();
      if (!response.ok) throw new Error(textResponse || `Erro HTTP ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(responseData && responseData.message ? responseData.message : `Erro HTTP ${response.status}`);
    }
    return responseData;
  } catch (error) {
    console.error(`Erro em fetchAPIPublic para ${endpoint}:`, error.message);
    alert(`Erro na comunicação (pública): ${error.message}`);
    throw error;
  }
}

// Nova função para lidar com a exclusão da conta
async function handleDeleteAccount() {
  const userNameForPrompt = localStorage.getItem('userName') || 'usuário';
  const confirmDelete = window.confirm(
    `ATENÇÃO, ${userNameForPrompt}!\n\n` +
    `Você tem CERTEZA que deseja excluir sua conta permanentemente?\n\n` +
    `TODOS os seus dados, incluindo agendamentos, serão perdidos e esta ação NÃO PODE SER DESFEITA.`
  );

  if (confirmDelete) {
    if (deleteAccountBtn) deleteAccountBtn.disabled = true;
    if (logoutBtn) logoutBtn.disabled = true;
    try {
      console.log("Usuário confirmou a exclusão da conta.");
      const result = await fetchAPISecured('/usuarios/minha-conta', { method: 'DELETE' });
      // Se a resposta for 204 No Content, result será null, o que é ok.
      // Se houver uma mensagem JSON, ela estará em result.message
      alert(result?.message || 'Sua conta foi excluída com sucesso.');

      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      window.location.href = 'auth/login.html'; // Ajuste o caminho
    } catch (error) {
      console.error("Erro ao excluir conta:", error.message);
      // A mensagem de erro específica já deve ter sido mostrada por fetchAPISecured,
      // exceto se o erro ocorreu antes da chamada fetch (ex: token não encontrado).
      // Se o erro foi "Não autorizado", o usuário já foi redirecionado.
      // Reabilitar botões se a exclusão falhou por um motivo que não deslogou o usuário.
      if (error.message !== "Não autorizado" && error.message !== "Token não encontrado para requisição segura") {
        if (deleteAccountBtn) deleteAccountBtn.disabled = false;
        if (logoutBtn) logoutBtn.disabled = false;
      }
    }
  } else {
    console.log("Usuário cancelou a exclusão da conta.");
  }
}


async function carregarBarbeiros() {
  try {
    const barbeiros = await fetchAPIPublic('/barbeiros');
    if (!barbeiroSelect) { console.error("barbeiroSelect não definido em carregarBarbeiros"); return; }
    barbeiroSelect.innerHTML = '<option value="">Selecione um barbeiro</option>';
    barbeiros.forEach(barbeiro => {
      const option = document.createElement('option');
      option.value = barbeiro.id; option.textContent = barbeiro.nome;
      barbeiroSelect.appendChild(option);
    });
  } catch (error) { /* erro já tratado em fetchAPIPublic */ }
}

async function carregarServicos() {
  try {
    const servicos = await fetchAPIPublic('/servicos');
    if (!corteSelect) { console.error("corteSelect não definido em carregarServicos"); return; }
    corteSelect.innerHTML = '<option value="">Selecione um serviço</option>';
    servicos.forEach(servico => {
      const option = document.createElement('option');
      option.value = servico.id;
      option.textContent = `${servico.nome} (${servico.duracao_minutos} min)`;
      corteSelect.appendChild(option);
    });
  } catch (error) { /* erro já tratado em fetchAPIPublic */ }
}

async function carregarHorariosDisponiveis(barbeiroId, data, servicoId) {
  if (!horarioSelect) { console.error("horarioSelect não definido"); return; }
  if (!barbeiroId || !data || !servicoId) {
    horarioSelect.innerHTML = '<option value="">Complete as seleções anteriores</option>'; return;
  }
  horarioSelect.innerHTML = '<option value="">Carregando...</option>';
  try {
    const horarios = await fetchAPIPublic(`/horarios-disponiveis?barbeiroId=${barbeiroId}&data=${data}&servicoId=${servicoId}`);
    horarioSelect.innerHTML = '';
    if (!horarios || horarios.length === 0) {
      horarioSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
    } else {
      horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
      horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario; option.textContent = horario;
        horarioSelect.appendChild(option);
      });
    }
  } catch (error) {
    horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
  }
}

function showStep(stepNumber) {
  document.querySelectorAll('.step').forEach((stepDiv) => {
    stepDiv.classList.add('d-none');
  });
  const currentStepDiv = document.getElementById(`step${stepNumber}`);
  if (currentStepDiv) {
    currentStepDiv.classList.remove('d-none');
  } else {
    console.error("Div da etapa", stepNumber, "não encontrada!");
  }
  updateButtonVisibility();
}

function updateButtonVisibility() {
  if (!btnVoltar || !btnProximo) { return; }
  btnVoltar.classList.toggle('d-none', currentStep === 1);
  btnProximo.textContent = (currentStep === 4) ? 'Confirmar Agendamento' : 'Próximo';
}

async function nextStep() {
  if (currentStep === 1 && !barbeiroSelect.value) {
    alert("Selecione um barbeiro."); return;
  }
  if (currentStep === 2 && (!corteSelect || !corteSelect.value)) {
    alert("Selecione um serviço."); return;
  }
  if (currentStep === 3 && (!dataSelecionadaInput || !dataSelecionadaInput.value)) {
    alert("Selecione uma data."); return;
  }

  if (currentStep === 3) {
    agendamentoData.barbeiroId = barbeiroSelect.value;
    agendamentoData.servicoId = corteSelect.value;
    agendamentoData.data = dataSelecionadaInput.value;
    await carregarHorariosDisponiveis(agendamentoData.barbeiroId, agendamentoData.data, agendamentoData.servicoId);
  }

  if (currentStep < 4) {
    currentStep++;
    showStep(currentStep);
  } else {
    agendamentoData.horario = horarioSelect ? horarioSelect.value : null;
    if (!agendamentoData.horario) {
      alert("Selecione um horário."); return;
    }

    agendamentoData.barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex].text;
    agendamentoData.servicoNome = corteSelect.options[corteSelect.selectedIndex].text;

    try {
      if (btnProximo) { btnProximo.disabled = true; btnProximo.textContent = 'Enviando...'; }
      const payload = {
        barbeiroId: parseInt(agendamentoData.barbeiroId),
        servicoId: parseInt(agendamentoData.servicoId),
        data: agendamentoData.data,
        horario: agendamentoData.horario,
      };
      const resultado = await fetchAPISecured('/agendamentos', { method: 'POST', body: JSON.stringify(payload) });
      alert(`Agendamento confirmado!\nBarbeiro: ${agendamentoData.barbeiroNome}\nServiço: ${agendamentoData.servicoNome}\nData: ${agendamentoData.data}\nHorário: ${agendamentoData.horario}`);
      resetModal();
      if (modalInstanceBootstrap) modalInstanceBootstrap.hide();
    } catch (error) { /* erro já alertado em fetchAPISecured */ }
    finally {
      if (btnProximo) { btnProximo.disabled = false; updateButtonVisibility(); }
    }
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

function resetModal() {
  if (barbeiroSelect) barbeiroSelect.value = "";
  if (corteSelect) corteSelect.value = "";
  if (dataSelecionadaInput) dataSelecionadaInput.value = "";
  if (horarioSelect) horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
  const selectedDay = document.querySelector('#days div.selected-day');
  if (selectedDay) selectedDay.classList.remove('selected-day');
  agendamentoData = { barbeiroId: null, servicoId: null, data: null, horario: null, barbeiroNome: null, servicoNome: null };
  currentStep = 1;
  if (modalElement) {
    showStep(currentStep); // Mostra a primeira etapa
    updateButtonVisibility(); // Garante que os botões estejam corretos
  }
}

let calendarioDate = new Date();

function initializeCalendar() {
  renderCalendar();
  if (prevMonthButton && nextMonthButton) {
    prevMonthButton.onclick = () => { calendarioDate.setMonth(calendarioDate.getMonth() - 1); renderCalendar(); };
    nextMonthButton.onclick = () => { calendarioDate.setMonth(calendarioDate.getMonth() + 1); renderCalendar(); };
  }
}

function renderCalendar() {
  if (!daysContainer || !monthYearHeader) { return; }
  const year = calendarioDate.getFullYear(); const month = calendarioDate.getMonth();
  monthYearHeader.textContent = `${calendarioDate.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
  daysContainer.innerHTML = "";
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  for (let i = 0; i < firstDayOfMonth; i++) daysContainer.innerHTML += "<div></div>";

  for (let d = 1; d <= lastDateOfMonth; d++) {
    const currentDateBeingRendered = new Date(year, month, d);
    const div = document.createElement("div"); div.textContent = d;
    const dataFormatadaParaComparacao = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (currentDateBeingRendered < today) {
      div.classList.add('past-day');
    } else {
      if (currentDateBeingRendered.getTime() === today.getTime()) {
        div.classList.add('today');
      }
      div.addEventListener('click', () => {
        if (dataSelecionadaInput) {
          dataSelecionadaInput.value = dataFormatadaParaComparacao;
        }
        document.querySelectorAll('#days div.selected-day').forEach(el => el.classList.remove('selected-day'));
        div.classList.add('selected-day');
        handleSelecaoPrincipal();
      });
    }
    if (dataSelecionadaInput && dataSelecionadaInput.value === dataFormatadaParaComparacao) {
      div.classList.add('selected-day');
    }
    daysContainer.appendChild(div);
  }
}

function handleSelecaoPrincipal() {
  if (!barbeiroSelect || !corteSelect || !dataSelecionadaInput) { return; }
  const barbeiroId = barbeiroSelect.value;
  const servicoId = corteSelect.value;
  const data = dataSelecionadaInput.value;

  if (barbeiroId && servicoId && data && (currentStep === 3 || currentStep === 4)) {
    carregarHorariosDisponiveis(barbeiroId, data, servicoId);
  } else if (currentStep === 3 || currentStep === 4) {
    if (horarioSelect) horarioSelect.innerHTML = '<option value="">Complete as seleções anteriores</option>';
  }
}