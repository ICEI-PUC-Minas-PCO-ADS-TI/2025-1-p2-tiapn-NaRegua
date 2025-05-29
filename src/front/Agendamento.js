// Seu Agendamento.js

let currentStep = 1;

function showStep(step) {
  document.querySelectorAll('.step').forEach((el, idx) => {
    if (idx === step - 1) {
      el.classList.remove('d-none');
    } else {
      el.classList.add('d-none');
    }
  });
}

function nextStep() {
  if (currentStep < 4) {
    currentStep++;
    showStep(currentStep);
  } else {
    // Finalização do agendamento
    const barbeiro = document.getElementById('barbeiroSelect').value;
    const corte = document.getElementById('corteSelect').value;
    const data = document.getElementById('dataSelecionada').value;
    const horario = document.getElementById('horarioSelect').value;

    console.log(`Agendamento: ${barbeiro}, ${corte}, ${data}, ${horario}`);
    alert(`Agendamento concluído:\nBarbeiro: ${barbeiro}\nCorte: ${corte}\nData: ${data}\nHorário: ${horario}`);
    
    // Aqui você pode enviar os dados para o backend

    // --- INÍCIO DO RESET DO MODAL ---
    // 1. Resetar os campos do formulário
    document.getElementById('barbeiroSelect').value = ""; // Para <option value="">Selecione</option>
    document.getElementById('corteSelect').value = "";   // Para <option value="">Selecione</option>
    document.getElementById('dataSelecionada').value = "";
    document.getElementById('horarioSelect').selectedIndex = 0; // Volta para o primeiro horário (09:00)

    // 2. Resetar visualização do calendário (remover destaque do dia)
    // Limpa os estilos inline aplicados ao selecionar um dia
    document.querySelectorAll('#days div').forEach(dayDiv => {
      dayDiv.style.backgroundColor = "";
      dayDiv.style.color = "";
      // Se você estivesse usando uma classe 'selected-day', removeria ela aqui:
      // dayDiv.classList.remove('selected-day');
    });

    // 3. Voltar para a primeira etapa do modal
    currentStep = 1;
    showStep(currentStep);

    // 4. Fechar o modal (usando a API do Bootstrap)
    const modalElement = document.getElementById('staticBackdrop');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    // --- FIM DO RESET DO MODAL ---
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

showStep(currentStep); // Inicia no step 1

// ---------------------------
// Calendário (seu código existente do calendário)
// ... (restante do seu código JS) ...
const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const inputDataSelecionada = document.getElementById("dataSelecionada");

let date = new Date(); // Data atual

function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  monthYear.textContent = `${months[month]} ${year}`;
  daysContainer.innerHTML = "";

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysContainer.innerHTML += "<div></div>";
  }

  for (let d = 1; d <= lastDateOfMonth; d++) {
    const currentDateBeingRendered = new Date(year, month, d);
    let classesParaODia = "";

    const isTodayCondition = d === today.getDate() &&
                              month === today.getMonth() &&
                              year === today.getFullYear();

    if (currentDateBeingRendered < todayDateOnly) {
      classesParaODia = 'past-day';
    } else if (isTodayCondition) {
      classesParaODia = 'today';
    }

    const div = document.createElement("div");
    div.className = classesParaODia;
    div.textContent = d;

    if (!div.classList.contains('past-day')) {
      div.addEventListener('click', () => {
        const diaSelecionado = d < 10 ? `0${d}` : d;
        const mesSelecionado = (month + 1) < 10 ? `0${month + 1}` : (month + 1);
        const dataFormatada = `${year}-${mesSelecionado}-${diaSelecionado}`;

        inputDataSelecionada.value = dataFormatada;

        document.querySelectorAll('#days div').forEach(el => {
          el.style.backgroundColor = "";
          el.style.color = "";
        });

        div.style.backgroundColor = "#0d6efd"; // Cor de seleção do dia
        div.style.color = "#fff";

        // Avança para o próximo passo automaticamente
        nextStep();
      });
    }
    daysContainer.appendChild(div);
  }
}

prev.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

next.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar(); // Inicializa o calendário