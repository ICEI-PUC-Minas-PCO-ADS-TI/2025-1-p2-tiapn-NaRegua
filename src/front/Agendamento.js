let currentStep = 1;

  function showStep(step) {
    document.querySelectorAll(".step").forEach(el => el.classList.add("d-none"));
    document.getElementById(`step${step}`).classList.remove("d-none");

    // Esconde o botão de voltar na primeira etapa
    document.querySelector(".btn-secondary").style.display = step === 1 ? "none" : "inline-block";

    // Troca o texto do botão "Próximo" para "Finalizar" na última etapa
    const nextBtn = document.querySelector(".btn-primary");
    nextBtn.textContent = step === 4 ? "Finalizar" : "Próximo";
  }

  function nextStep() {
    if (currentStep < 4) {
      currentStep++;
      showStep(currentStep);
    } else {
      // Coleta os dados do formulário
      const agendamento = {
        barbeiro: document.getElementById("barbeiroSelect").value,
        corte: document.getElementById("corteSelect").value,
        data: "DATA_DO_CALENDARIO", // Substitua pela data escolhida
        horario: document.getElementById("horarioSelect").value
      };

      console.log("Agendamento finalizado:", agendamento);

      // Fecha o modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
      modal.hide();
    }
  }

  function previousStep() {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  }

  // Sempre que o modal abrir, reinicia o passo
  document.getElementById('staticBackdrop').addEventListener('show.bs.modal', () => {
    currentStep = 1;
    showStep(currentStep);
  });

