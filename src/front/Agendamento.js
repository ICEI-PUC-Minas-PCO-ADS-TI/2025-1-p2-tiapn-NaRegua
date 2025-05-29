// Agendamento.js

// --- CONFIGURAÇÕES E CONSTANTES ---
const API_URL = 'http://localhost:3000/api'; // URL base do seu backend
let currentStep = 1;
let agendamentoData = { // Objeto para armazenar os dados do agendamento
  barbeiroId: null,
  servicoId: null,
  data: null,
  horario: null,
  barbeiroNome: null, // Para feedback ao usuário
  servicoNome: null   // Para feedback ao usuário
};

// --- ELEMENTOS DO DOM ---
let barbeiroSelect, corteSelect, horarioSelect, dataSelecionadaInput;
let daysContainer, monthYearHeader, prevMonthButton, nextMonthButton;
let modalElement, modalInstanceBootstrap;
let btnVoltar, btnProximo;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona os elementos após o DOM estar carregado
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
  if (modalElement) { // Garante que o modal existe antes de tentar obter a instância
    modalInstanceBootstrap = bootstrap.Modal.getOrCreateInstance(modalElement); // Use getOrCreateInstance
  }


  // Carregar dados iniciais
  carregarBarbeiros();
  carregarServicos();

  // Configurar calendário
  initializeCalendar(); // Função para encapsular a lógica do calendário

  // Exibir a primeira etapa
  showStep(currentStep);
  updateButtonVisibility();

  // Listeners para os selects principais (para recarregar horários se necessário)
  barbeiroSelect.addEventListener('change', handleSelecaoPrincipal);
  corteSelect.addEventListener('change', handleSelecaoPrincipal);
});

// --- FUNÇÕES DE CARREGAMENTO DE DADOS (API) ---
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Erro ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    alert(`Erro na comunicação com o servidor: ${error.message}`);
    throw error; // Re-throw para que a função chamadora possa tratar
  }
}

async function carregarBarbeiros() {
  try {
    const barbeiros = await fetchAPI('/barbeiros');
    barbeiroSelect.innerHTML = '<option value="">Selecione um barbeiro</option>';
    barbeiros.forEach(barbeiro => {
      const option = document.createElement('option');
      option.value = barbeiro.id;
      option.textContent = barbeiro.nome;
      barbeiroSelect.appendChild(option);
    });
  } catch (error) {
    // O erro já é logado e alertado por fetchAPI
  }
}

async function carregarServicos() {
  try {
    const servicos = await fetchAPI('/servicos');
    corteSelect.innerHTML = '<option value="">Selecione um serviço</option>';
    servicos.forEach(servico => {
      const option = document.createElement('option');
      option.value = servico.id;
      option.textContent = `${servico.nome} (${servico.duracao_minutos} min)`;
      corteSelect.appendChild(option);
    });
  } catch (error) {
    // O erro já é logado e alertado por fetchAPI
  }
}

async function carregarHorariosDisponiveis(barbeiroId, data, servicoId) {
  if (!barbeiroId || !data || !servicoId) {
    horarioSelect.innerHTML = '<option value="">Complete as seleções anteriores</option>';
    return;
  }
  horarioSelect.innerHTML = '<option value="">Carregando horários...</option>';
  try {
    const horarios = await fetchAPI(`/horarios-disponiveis?barbeiroId=${barbeiroId}&data=${data}&servicoId=${servicoId}`);
    horarioSelect.innerHTML = ''; // Limpa
    if (horarios.length === 0) {
      horarioSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
    } else {
      horarioSelect.innerHTML = '<option value="">Selecione um horário</option>'; // Adiciona opção padrão
      horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        horarioSelect.appendChild(option);
      });
    }
  } catch (error) {
    horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
  }
}

// --- LÓGICA DO MODAL MULTI-STEP ---
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
  if (currentStep === 1) {
    btnVoltar.classList.add('d-none'); // Ou style.display = 'none';
    btnProximo.classList.remove('d-none');
    btnProximo.textContent = 'Próximo';
  } else if (currentStep === 4) {
    btnVoltar.classList.remove('d-none');
    btnProximo.classList.remove('d-none');
    btnProximo.textContent = 'Confirmar Agendamento';
  } else {
    btnVoltar.classList.remove('d-none');
    btnProximo.classList.remove('d-none');
    btnProximo.textContent = 'Próximo';
  }
}

async function nextStep() {
  // Validações
  if (currentStep === 1 && !barbeiroSelect.value) {
    alert("Por favor, selecione um barbeiro.");
    return;
  }
  if (currentStep === 2 && !corteSelect.value) {
    alert("Por favor, selecione um serviço.");
    return;
  }
  if (currentStep === 3 && !dataSelecionadaInput.value) {
    alert("Por favor, selecione uma data no calendário.");
    return;
  }
  if (currentStep === 3) { // Ao sair da etapa de data, carrega horários
    agendamentoData.barbeiroId = barbeiroSelect.value;
    agendamentoData.servicoId = corteSelect.value;
    agendamentoData.data = dataSelecionadaInput.value;
    if (agendamentoData.barbeiroId && agendamentoData.servicoId && agendamentoData.data) {
      await carregarHorariosDisponiveis(agendamentoData.barbeiroId, agendamentoData.data, agendamentoData.servicoId);
    } else {
      alert("Verifique as seleções de barbeiro, serviço e data.");
      return; // Impede de avançar se algo estiver faltando para carregar horários
    }
  }


  if (currentStep < 4) {
    currentStep++;
    showStep(currentStep);
  } else {
    // Última etapa: Confirmar Agendamento
    agendamentoData.horario = horarioSelect.value;
    if (!agendamentoData.horario) {
      alert("Por favor, selecione um horário.");
      return;
    }

    agendamentoData.barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex].text;
    agendamentoData.servicoNome = corteSelect.options[corteSelect.selectedIndex].text;

    try {
      btnProximo.disabled = true;
      btnProximo.textContent = 'Enviando...';

      const payload = {
        barbeiroId: parseInt(agendamentoData.barbeiroId),
        servicoId: parseInt(agendamentoData.servicoId),
        data: agendamentoData.data,
        horario: agendamentoData.horario,
        // nomeCliente: "Cliente Teste" // Adicionar se tiver campo no formulário
      };

      const resultado = await fetchAPI('/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      alert(`Agendamento confirmado com sucesso!\nID: ${resultado.agendamentoId}\nBarbeiro: ${agendamentoData.barbeiroNome}\nServiço: ${agendamentoData.servicoNome}\nData: ${agendamentoData.data}\nHorário: ${agendamentoData.horario}`);
      resetModal();
      if (modalInstanceBootstrap) modalInstanceBootstrap.hide();

    } catch (error) {
      // Erro já tratado em fetchAPI, mas pode adicionar tratamento específico aqui se necessário
      // alert(`Falha ao agendar: ${error.message}`); // Redundante se fetchAPI já alerta
    } finally {
      btnProximo.disabled = false;
      btnProximo.textContent = 'Confirmar Agendamento';
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
  barbeiroSelect.value = "";
  corteSelect.value = "";
  dataSelecionadaInput.value = "";
  horarioSelect.innerHTML = '<option value="">Selecione um horário</option>'; // Reseta para estado inicial

  // Limpar seleção visual do calendário
  document.querySelectorAll('#days div.selected-day').forEach(el => el.classList.remove('selected-day'));

  // Resetar objeto de dados do agendamento
  agendamentoData = { barbeiroId: null, servicoId: null, data: null, horario: null, barbeiroNome: null, servicoNome: null };

  currentStep = 1;
  showStep(currentStep); // Mostra a primeira etapa
  initializeCalendar(); // Re-renderiza o calendário para o mês atual se necessário
  updateButtonVisibility(); // Garante que os botões estão no estado correto
}

// Adicionar listener para o evento 'hidden.bs.modal' para resetar o formulário quando o modal é fechado
if (modalElement) {
  modalElement.addEventListener('hidden.bs.modal', event => {
    resetModal();
  });
}


// --- LÓGICA DO CALENDÁRIO ---
let calendarioDate = new Date(); // Data para navegação do calendário

function initializeCalendar() {
  renderCalendar(); // Renderiza o calendário inicial
  if (prevMonthButton && nextMonthButton) { // Adiciona listeners apenas uma vez
    prevMonthButton.removeEventListener('click', navigatePrevMonth); // Remove listener antigo para evitar duplicação
    prevMonthButton.addEventListener("click", navigatePrevMonth);

    nextMonthButton.removeEventListener('click', navigateNextMonth); // Remove listener antigo
    nextMonthButton.addEventListener("click", navigateNextMonth);
  }
}

function navigatePrevMonth() {
  calendarioDate.setMonth(calendarioDate.getMonth() - 1);
  renderCalendar();
}

function navigateNextMonth() {
  calendarioDate.setMonth(calendarioDate.getMonth() + 1);
  renderCalendar();
}

function renderCalendar() {
  const year = calendarioDate.getFullYear();
  const month = calendarioDate.getMonth();

  if (monthYearHeader) monthYearHeader.textContent = `${calendarioDate.toLocaleString('default', { month: 'long' })} ${year}`;
  if (!daysContainer) return; // Sai se o container dos dias não existe

  daysContainer.innerHTML = ""; // Limpa dias anteriores

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Preenche os espaços vazios no início do mês
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysContainer.innerHTML += "<div></div>";
  }

  // Renderiza os dias do mês
  for (let d = 1; d <= lastDateOfMonth; d++) {
    const currentDateBeingRendered = new Date(year, month, d);
    const div = document.createElement("div");
    div.textContent = d;

    if (currentDateBeingRendered < todayDateOnly) {
      div.classList.add('past-day');
    } else {
      if (currentDateBeingRendered.getTime() === todayDateOnly.getTime()) {
        div.classList.add('today');
      }
      div.addEventListener('click', () => {
        const diaSelecionado = d < 10 ? `0${d}` : d;
        const mesSelecionado = (month + 1) < 10 ? `0${month + 1}` : (month + 1);
        const dataFormatada = `${year}-${mesSelecionado}-${diaSelecionado}`;

        dataSelecionadaInput.value = dataFormatada;

        // Atualiza visualmente o dia selecionado
        document.querySelectorAll('#days div.selected-day').forEach(el => el.classList.remove('selected-day'));
        div.classList.add('selected-day');

        // Após selecionar a data, se barbeiro e serviço já estiverem selecionados, carrega horários
        handleSelecaoPrincipal();
      });
    }
    // Se a data renderizada é a mesma que está em dataSelecionadaInput, marca como 'selected-day'
    if (dataSelecionadaInput.value === `${year}-${(month + 1) < 10 ? `0${month + 1}` : (month + 1)}-${d < 10 ? `0${d}` : d}`) {
      div.classList.add('selected-day');
    }

    daysContainer.appendChild(div);
  }
}

// Função para lidar com mudanças nas seleções principais (barbeiro, serviço, data)
function handleSelecaoPrincipal() {
  const barbeiroId = barbeiroSelect.value;
  const servicoId = corteSelect.value;
  const data = dataSelecionadaInput.value;

  // Só carrega horários se todos os três estiverem preenchidos
  // E se estivermos na etapa de seleção de data (step 3) ou já na de horário (step 4)
  // Isso evita carregar horários desnecessariamente nas primeiras etapas.
  if (barbeiroId && servicoId && data && (currentStep === 3 || currentStep === 4)) {
    carregarHorariosDisponiveis(barbeiroId, data, servicoId);
  } else if (currentStep === 3 || currentStep === 4) {
    // Se um dos campos estiver faltando e já estamos na etapa de data/horário, limpa os horários
    horarioSelect.innerHTML = '<option value="">Complete as seleções anteriores</option>';
  }
}