const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let date = new Date(); // Esta 'date' controla o mês/ano que o calendário está exibindo

function renderCalendar() {
  const year = date.getFullYear(); // Ano do calendário sendo exibido
  const month = date.getMonth();   // Mês do calendário sendo exibido (0 = Janeiro)

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Dia da semana do 1º dia do mês (0=Domingo)
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); // Último dia do mês

  const today = new Date(); // Data e hora atuais
  // Criamos uma data para hoje, mas com a hora zerada, para comparações de "dia inteiro"
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  monthYear.textContent = `${months[month]} ${year}`;
  daysContainer.innerHTML = ""; // Limpa os dias anteriores

  // Adiciona divs vazias para os dias do mês anterior (para alinhar o 1º dia corretamente)
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysContainer.innerHTML += "<div></div>";
  }

  // Renderiza os dias do mês
  for (let d = 1; d <= lastDateOfMonth; d++) {
    const currentDateBeingRendered = new Date(year, month, d);
    let classesParaODia = ""; // String para armazenar as classes CSS do dia

    const isTodayCondition = d === today.getDate() &&
                           month === today.getMonth() &&
                           year === today.getFullYear();

    if (currentDateBeingRendered < todayDateOnly) {
      classesParaODia = 'past-day'; // Classe para dias passados
    } else if (isTodayCondition) {
      classesParaODia = 'today'; // Classe para o dia de hoje
    }
    // Dias futuros não recebem classes específicas por esta lógica,
    // eles usarão os estilos padrão de .days div.

    daysContainer.innerHTML += `<div class="${classesParaODia}">${d}</div>`;
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

renderCalendar(); // Renderiza o calendário quando a página carrega