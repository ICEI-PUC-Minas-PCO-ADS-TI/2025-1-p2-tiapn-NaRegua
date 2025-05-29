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
let userInfoDiv, logoutBtn;

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente carregado e parseado."); // DEBUG INICIAL

  const authToken = localStorage.getItem('authToken');
  const userName = localStorage.getItem('userName');

  userInfoDiv = document.getElementById('userInfo');
  logoutBtn = document.getElementById('logoutButton');

  if (!authToken) {
    console.log("Nenhum token de autenticação encontrado. Redirecionando para login..."); // DEBUG
    alert("Você precisa estar logado para agendar. Redirecionando para login...");
    window.location.href = 'auth/login.html'; // Ajuste o caminho conforme sua estrutura
    return; // Impede o resto do script de rodar
  }
  console.log("Token de autenticação encontrado:", authToken); // DEBUG

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

  console.log("Elemento barbeiroSelect:", barbeiroSelect); // DEBUG
  console.log("Elemento corteSelect:", corteSelect);     // DEBUG
  console.log("Elemento modalElement:", modalElement);   // DEBUG


  if (modalElement) {
    modalInstanceBootstrap = bootstrap.Modal.getOrCreateInstance(modalElement);
    console.log("Instância do modal Bootstrap criada/obtida."); // DEBUG
  }


  if (barbeiroSelect) carregarBarbeiros();
  if (corteSelect) carregarServicos();
  if (daysContainer) initializeCalendar();

  if (modalElement) {
    showStep(currentStep);
    updateButtonVisibility(); // Chamada inicial
    modalElement.addEventListener('hidden.bs.modal', resetModal);
  } else {
    console.warn("Elemento do modal principal (staticBackdrop) não encontrado. Algumas funcionalidades podem não operar."); // DEBUG
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
    console.warn("Tentando fazer requisição segura sem token."); // DEBUG
    // Tratar ausência de token aqui também, se necessário, antes da requisição
  }

  try {
    console.log(`fetchAPISecured: Tentando ${options.method || 'GET'} para ${API_URL}${endpoint}`); // DEBUG
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      alert("Sua sessão expirou ou é inválida. Por favor, faça login novamente.");
      window.location.href = 'auth/login.html';
      throw new Error("Não autorizado");
    }
    // Tenta pegar o corpo da resposta ANTES de checar response.ok para poder logar ou usar em mensagens
    let responseData = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json().catch(e => {
        console.error("Erro ao parsear JSON da resposta:", e); // DEBUG
        throw new Error("Resposta do servidor não é JSON válido, mesmo com content-type JSON.");
      });
    } else {
      // Se não for JSON, podemos tentar ler como texto para depuração
      const textResponse = await response.text();
      console.log("Resposta não-JSON do servidor:", textResponse); // DEBUG
      // Se a resposta não for JSON, mas a requisição foi OK, pode não haver 'message'.
      if (!response.ok) throw new Error(textResponse || `Erro HTTP ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(responseData ? responseData.message : `Erro HTTP ${response.status}`);
    }
    return responseData; // Retorna os dados parseados se JSON, ou null/undefined se não for JSON e ok
  } catch (error) {
    console.error(`Erro em fetchAPISecured para ${endpoint}:`, error.message);
    if (error.message !== "Não autorizado") {
      alert(`Erro na comunicação (segura): ${error.message}`);
    }
    throw error;
  }
}

async function fetchAPIPublic(endpoint, options = {}) {
  try {
    console.log(`fetchAPIPublic: Tentando ${options.method || 'GET'} para ${API_URL}${endpoint}`); // DEBUG
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
      console.log("Resposta não-JSON (pública) do servidor:", textResponse);
      if (!response.ok) throw new Error(textResponse || `Erro HTTP ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(responseData ? responseData.message : `Erro HTTP ${response.status}`);
    }
    return responseData;
  } catch (error) {
    console.error(`Erro em fetchAPIPublic para ${endpoint}:`, error.message);
    alert(`Erro na comunicação (pública): ${error.message}`);
    throw error;
  }
}

async function carregarBarbeiros() {
  console.log("carregarBarbeiros() chamado"); //DEBUG
  try {
    const barbeiros = await fetchAPIPublic('/barbeiros');
    if (!barbeiroSelect) { console.error("barbeiroSelect não definido em carregarBarbeiros"); return; } // DEBUG
    barbeiroSelect.innerHTML = '<option value="">Selecione um barbeiro</option>';
    barbeiros.forEach(barbeiro => {
      const option = document.createElement('option');
      option.value = barbeiro.id; option.textContent = barbeiro.nome;
      barbeiroSelect.appendChild(option);
    });
    console.log("Barbeiros carregados:", barbeiros); //DEBUG
  } catch (error) { console.error("Falha ao carregar barbeiros no catch da função:", error); /* erro já tratado em fetchAPIPublic */ }
}

async function carregarServicos() {
  console.log("carregarServicos() chamado"); //DEBUG
  try {
    const servicos = await fetchAPIPublic('/servicos');
    if (!corteSelect) { console.error("corteSelect não definido em carregarServicos"); return; } // DEBUG
    corteSelect.innerHTML = '<option value="">Selecione um serviço</option>';
    servicos.forEach(servico => {
      const option = document.createElement('option');
      option.value = servico.id;
      option.textContent = `${servico.nome} (${servico.duracao_minutos} min)`;
      corteSelect.appendChild(option);
    });
    console.log("Serviços carregados:", servicos); //DEBUG
  } catch (error) { console.error("Falha ao carregar serviços no catch da função:", error);/* erro já tratado em fetchAPIPublic */ }
}

async function carregarHorariosDisponiveis(barbeiroId, data, servicoId) {
  console.log(`carregarHorariosDisponiveis chamado com: barbeiroId=${barbeiroId}, data=${data}, servicoId=${servicoId}`); //DEBUG
  if (!horarioSelect) { console.error("horarioSelect não definido"); return; } // DEBUG
  if (!barbeiroId || !data || !servicoId) {
    horarioSelect.innerHTML = '<option value="">Complete as seleções</option>'; return;
  }
  horarioSelect.innerHTML = '<option value="">Carregando...</option>';
  try {
    const horarios = await fetchAPIPublic(`/horarios-disponiveis?barbeiroId=${barbeiroId}&data=${data}&servicoId=${servicoId}`);
    horarioSelect.innerHTML = ''; // Limpa antes de adicionar novas opções
    if (!horarios || horarios.length === 0) { // Checa se horarios é null/undefined ou array vazio
      horarioSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
    } else {
      horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
      horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario; option.textContent = horario;
        horarioSelect.appendChild(option);
      });
    }
    console.log("Horários disponíveis carregados:", horarios); //DEBUG
  } catch (error) {
    horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
    console.error("Falha ao carregar horários no catch da função:", error); //DEBUG
  }
}

function showStep(stepNumber) {
  console.log("showStep() foi chamada para a etapa:", stepNumber); // DEBUG
  document.querySelectorAll('.step').forEach((stepDiv) => {
    stepDiv.classList.add('d-none');
  });
  const currentStepDiv = document.getElementById(`step${stepNumber}`);
  if (currentStepDiv) {
    console.log("Mostrando div:", currentStepDiv.id); // DEBUG
    currentStepDiv.classList.remove('d-none');
  } else {
    console.error("Div da etapa", stepNumber, "não encontrada! Verifique os IDs no HTML (step1, step2, etc)."); // DEBUG
  }
  updateButtonVisibility();
}

function updateButtonVisibility() {
  if (!btnVoltar || !btnProximo) {
    console.warn("Botões Voltar/Próximo não encontrados em updateButtonVisibility"); // DEBUG
    return;
  }
  console.log("updateButtonVisibility() chamada. Etapa atual:", currentStep); // DEBUG
  btnVoltar.classList.toggle('d-none', currentStep === 1);
  btnProximo.textContent = (currentStep === 4) ? 'Confirmar Agendamento' : 'Próximo';
}

async function nextStep() {
  console.log("nextStep() foi chamada. Etapa ATUAL (currentStep):", currentStep); // DEBUG
  if (barbeiroSelect) {
    console.log("Valor selecionado no barbeiroSelect:", barbeiroSelect.value); // DEBUG
  } else {
    console.error("Elemento barbeiroSelect não encontrado em nextStep!"); // DEBUG
    alert("Erro interno: campo de barbeiro não encontrado.");
    return;
  }

  // Validações
  if (currentStep === 1 && !barbeiroSelect.value) { // Se value for "" (string vazia da option "Selecione")
    alert("Selecione um barbeiro.");
    console.log("Validação falhou em nextStep: Nenhum barbeiro selecionado. Valor do select:", barbeiroSelect.value); // DEBUG
    return;
  }
  if (currentStep === 2 && (!corteSelect || !corteSelect.value)) { // Checa se corteSelect existe também
    alert("Selecione um serviço.");
    console.log("Validação falhou em nextStep: Nenhum serviço selecionado."); // DEBUG
    return;
  }
  if (currentStep === 3 && (!dataSelecionadaInput || !dataSelecionadaInput.value)) { // Checa se dataSelecionadaInput existe
    alert("Selecione uma data.");
    console.log("Validação falhou em nextStep: Nenhuma data selecionada."); // DEBUG
    return;
  }

  if (currentStep === 3) {
    console.log("Etapa 3 (Dia) concluída, carregando horários antes de ir para etapa 4..."); // DEBUG
    agendamentoData.barbeiroId = barbeiroSelect.value;
    agendamentoData.servicoId = corteSelect.value;
    agendamentoData.data = dataSelecionadaInput.value;
    await carregarHorariosDisponiveis(agendamentoData.barbeiroId, agendamentoData.data, agendamentoData.servicoId);
  }

  if (currentStep < 4) {
    currentStep++;
    console.log("Avançando para a próxima etapa. Nova etapa (currentStep):", currentStep); // DEBUG
    showStep(currentStep);
  } else { // currentStep === 4, Finalização do agendamento
    console.log("Tentando finalizar o agendamento na etapa 4."); // DEBUG
    agendamentoData.horario = horarioSelect ? horarioSelect.value : null;
    if (!agendamentoData.horario) {
      alert("Selecione um horário.");
      console.log("Validação falhou em nextStep (etapa 4): Nenhum horário selecionado."); //DEBUG
      return;
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
      console.log("Enviando payload para /agendamentos:", payload); // DEBUG
      const resultado = await fetchAPISecured('/agendamentos', { method: 'POST', body: JSON.stringify(payload) });
      console.log("Resposta do agendamento:", resultado); // DEBUG
      alert(`Agendamento confirmado!\nBarbeiro: ${agendamentoData.barbeiroNome}\nServiço: ${agendamentoData.servicoNome}\nData: ${agendamentoData.data}\nHorário: ${agendamentoData.horario}`);
      resetModal();
      if (modalInstanceBootstrap) modalInstanceBootstrap.hide();
    } catch (error) {
      console.error("Erro ao finalizar agendamento no catch de nextStep:", error); // DEBUG
      /* erro já alertado em fetchAPISecured */
    }
    finally {
      if (btnProximo) { btnProximo.disabled = false; updateButtonVisibility(); }
    }
  }
}

function previousStep() {
  console.log("previousStep() chamada. Etapa ATUAL (currentStep):", currentStep); // DEBUG
  if (currentStep > 1) {
    currentStep--;
    console.log("Retornando para etapa anterior. Nova etapa (currentStep):", currentStep); // DEBUG
    showStep(currentStep);
  }
}

function resetModal() {
  console.log("resetModal() chamado."); // DEBUG
  if (barbeiroSelect) barbeiroSelect.value = "";
  if (corteSelect) corteSelect.value = "";
  if (dataSelecionadaInput) dataSelecionadaInput.value = "";
  if (horarioSelect) horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';

  const selectedDay = document.querySelector('#days div.selected-day');
  if (selectedDay) selectedDay.classList.remove('selected-day');

  agendamentoData = { barbeiroId: null, servicoId: null, data: null, horario: null, barbeiroNome: null, servicoNome: null };
  currentStep = 1;
  if (modalElement) showStep(currentStep);
  if (modalElement) updateButtonVisibility();
}

let calendarioDate = new Date(); // Data para navegação do calendário

function initializeCalendar() {
  console.log("initializeCalendar() chamado"); //DEBUG
  renderCalendar();
  if (prevMonthButton && nextMonthButton) { // Evita adicionar múltiplos listeners se chamado mais de uma vez
    prevMonthButton.onclick = () => { calendarioDate.setMonth(calendarioDate.getMonth() - 1); renderCalendar(); };
    nextMonthButton.onclick = () => { calendarioDate.setMonth(calendarioDate.getMonth() + 1); renderCalendar(); };
  } else {
    console.warn("Botões de navegação do calendário (prev/next) não encontrados."); //DEBUG
  }
}

function renderCalendar() {
  if (!daysContainer || !monthYearHeader) {
    console.warn("Elementos do calendário (daysContainer ou monthYearHeader) não encontrados em renderCalendar."); //DEBUG
    return;
  }
  // console.log("renderCalendar() chamado para:", calendarioDate.toLocaleDateString('pt-BR')); //DEBUG (pode ser muito verboso)
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
          console.log("Data selecionada no calendário:", dataFormatadaParaComparacao); //DEBUG
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
  console.log("handleSelecaoPrincipal() chamado."); //DEBUG
  if (!barbeiroSelect || !corteSelect || !dataSelecionadaInput) {
    console.warn("Um ou mais elementos de seleção principal não encontrados em handleSelecaoPrincipal."); //DEBUG
    return;
  }
  const barbeiroId = barbeiroSelect.value;
  const servicoId = corteSelect.value;
  const data = dataSelecionadaInput.value;

  if (barbeiroId && servicoId && data && (currentStep === 3 || currentStep === 4)) {
    console.log("Todas as seleções principais feitas, carregando horários..."); //DEBUG
    carregarHorariosDisponiveis(barbeiroId, data, servicoId);
  } else if (currentStep === 3 || currentStep === 4) {
    if (horarioSelect) horarioSelect.innerHTML = '<option value="">Complete as seleções</option>';
    console.log("Seleções principais incompletas para carregar horários."); //DEBUG
  }
}