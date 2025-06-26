// src/front/js/Agendamento.js

const API_URL = 'http://localhost:3000/api';
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

document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken');
  const userName = localStorage.getItem('userName');
  const userMenuContainer = document.getElementById('userMenuContainer');

  // --- LÓGICA DO MENU DE USUÁRIO (NOVO) ---
  if (!authToken || !userMenuContainer) {
    alert("Você precisa estar logado para acessar esta página. Redirecionando para login...");
    window.location.href = '../html/login.html';
    return;
  }

  const userDropdownToggle = userMenuContainer.querySelector('#navbarUserDropdown');
  const logoutBtn = userMenuContainer.querySelector('#logoutButton');
  const deleteAccountBtn = userMenuContainer.querySelector('#deleteAccountButton');

  if (userDropdownToggle && userName) {
    userDropdownToggle.textContent = `Olá, ${userName}`;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      alert('Você foi desconectado.');
      window.location.href = '../html/login.html';
    });
  }

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', handleDeleteAccount);
  }

  // --- LÓGICA DE AGENDAMENTO (EXISTENTE) ---
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
    modalElement.addEventListener('hidden.bs.modal', resetModal);
  }

  if (barbeiroSelect) carregarBarbeiros();
  if (corteSelect) carregarServicos();
  if (daysContainer) initializeCalendar();

  if (modalElement) {
    showStep(currentStep);
    updateButtonVisibility();
  }

  if (barbeiroSelect) barbeiroSelect.addEventListener('change', handleSelecaoPrincipal);
  if (corteSelect) corteSelect.addEventListener('change', handleSelecaoPrincipal);
});

// A função handleDeleteAccount e as outras funções (fetch, etc.) permanecem as mesmas
async function handleDeleteAccount() {
  const userNameForPrompt = localStorage.getItem('userName') || 'usuário';
  if (window.confirm(`ATENÇÃO, ${userNameForPrompt}!\n\nVocê tem CERTEZA que deseja excluir sua conta permanentemente?\n\nTODOS os seus dados, incluindo agendamentos, serão perdidos.`)) {
    const deleteBtnInsideDropdown = document.getElementById('deleteAccountButton');
    if (deleteBtnInsideDropdown) deleteBtnInsideDropdown.disabled = true;
    try {
      await fetchAPISecured('/usuarios/minha-conta', { method: 'DELETE' });
      alert('Sua conta foi excluída com sucesso.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      window.location.href = '../html/login.html';
    } catch (error) {
      if (deleteBtnInsideDropdown) deleteBtnInsideDropdown.disabled = false;
    }
  }
}

async function fetchAPISecured(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    alert("Sua sessão pode ter expirado. Por favor, faça login novamente.");
    window.location.href = '../html/login.html';
    throw new Error("Token não encontrado");
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      alert("Sua sessão expirou ou é inválida. Faça login novamente.");
      window.location.href = '../html/login.html';
      throw new Error("Não autorizado");
    }

    let responseData = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json().catch(e => { throw new Error("JSON inválido."); });
    } else {
      const textResponse = await response.text();
      if (!response.ok) throw new Error(textResponse || `Erro HTTP ${response.status}`);
    }
    if (!response.ok) { throw new Error(responseData?.message || `Erro HTTP ${response.status}`); }
    return responseData;
  } catch (error) {
    console.error(`Erro em fetchAPISecured para ${endpoint}:`, error.message);
    if (error.message !== "Não autorizado" && error.message !== "Token não encontrado") {
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
      responseData = await response.json().catch(e => { throw new Error("JSON inválido."); });
    } else {
      const textResponse = await response.text();
      if (!response.ok) throw new Error(textResponse || `Erro HTTP ${response.status}`);
    }
    if (!response.ok) { throw new Error(responseData?.message || `Erro HTTP ${response.status}`); }
    return responseData;
  } catch (error) {
    console.error(`Erro em fetchAPIPublic para ${endpoint}:`, error.message);
    alert(`Erro na comunicação (pública): ${error.message}`);
    throw error;
  }
}

async function carregarBarbeiros() {
  try {
    const barbeiros = await fetchAPIPublic('/barbeiros');
    if (!barbeiroSelect) { return; }
    barbeiroSelect.innerHTML = '<option value="">Selecione um barbeiro</option>';
    barbeiros.forEach(barbeiro => {
      const option = document.createElement('option');
      option.value = barbeiro.id; option.textContent = barbeiro.nome;
      barbeiroSelect.appendChild(option);
    });
  } catch (error) { /* erro já alertado em fetchAPIPublic */ }
}

async function carregarServicos() {
  try {
    const servicos = await fetchAPIPublic('/servicos');
    if (!corteSelect) { return; }
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
  if (!horarioSelect) { return; }
  if (!barbeiroId || !data || !servicoId) {
    horarioSelect.innerHTML = '<option value="">Complete as seleções</option>'; return;
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
      await fetchAPISecured('/agendamentos', { method: 'POST', body: JSON.stringify(payload) });
      alert(`Agendamento confirmado!\nBarbeiro: ${agendamentoData.barbeiroNome}\nServiço: ${agendamentoData.servicoNome}\nData: ${agendamentoData.data}\nHorário: ${agendamentoData.horario}`);
      resetModal();
      if (modalInstanceBootstrap) modalInstanceBootstrap.hide();
    } catch (error) { /* erro já alertado */ }
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
    showStep(currentStep);
    updateButtonVisibility();
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
    if (horarioSelect) horarioSelect.innerHTML = '<option value="">Complete as seleções</option>';
  }
}