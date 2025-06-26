// src/front/js/adm.js

const API_BASE_URL_ADM = 'http://localhost:3000/api';
let allProducts = [];
let produtoModalInstance;

// --- Lógica de Proteção e Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  const isAdmin = localStorage.getItem('isAdmin');
  const authToken = localStorage.getItem('authToken');

  if (isAdmin !== 'true' || !authToken) {
    alert('Acesso negado. Esta área é exclusiva para administradores.');
    window.location.href = '../html/login.html';
    return;
  }

  initializeAdminPanel();
});


function initializeAdminPanel() {
  // Lógica da Sidebar
  const body = document.querySelector("body");
  const sidebar = body.querySelector("nav");
  const sidebarToggle = body.querySelector(".sidebar-toggle");
  const adminLogoutBtn = document.getElementById('adminLogoutBtn'); // Seleciona o botão de logout
  const adminProfileName = document.getElementById('adminProfileName');

  if (sidebar && sidebarToggle) {
    let getStatus = localStorage.getItem("sidebar_status");
    if (getStatus && getStatus === "close") {
      sidebar.classList.add("close");
    }
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("close");
      localStorage.setItem("sidebar_status", sidebar.classList.contains("close") ? "close" : "open");
    });
  }

  // Lógica de Logout do Admin (CORRETA)
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Impede que o link navegue para "#"
      localStorage.clear(); // Limpa token, nome, status de admin, etc.
      alert('Você foi desconectado da área administrativa.');
      window.location.href = '../html/login.html';
    });
  }

  const userName = localStorage.getItem('userName');
  if (adminProfileName && userName) {
    adminProfileName.textContent = `Olá, ${userName}`;
  }

  // Carregar todos os dados dinâmicos do painel
  carregarDadosDashboard();

  // Lógica do Modal de Produtos
  const produtoModalEl = document.getElementById('produtoModal');
  if (produtoModalEl) {
    produtoModalInstance = bootstrap.Modal.getOrCreateInstance(produtoModalEl);
    document.getElementById('btnAdicionarProduto').addEventListener('click', () => abrirModalProduto());
    document.getElementById('produtoForm').addEventListener('submit', handleProdutoFormSubmit);
  }
}

// Função genérica para requisições seguras de admin
async function fetchAdminData(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  try {
    const response = await fetch(`${API_BASE_URL_ADM}${endpoint}`, { ...defaultOptions, ...options });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.href = '../html/login.html';
      }
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro: ${response.statusText}`);
    }
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error(`Falha ao realizar operação em ${endpoint}:`, error);
    alert(`Não foi possível realizar a operação: ${error.message}`);
    throw error;
  }
}

// Função principal que carrega todos os dados do dashboard
async function carregarDadosDashboard() {
  try {
    await carregarAgendamentosEKpis();
    await carregarProdutosAdmin();
  } catch (error) {
    console.error("Falha ao carregar um ou mais componentes do dashboard.");
  }
}

// Carrega os KPIs e a tabela de agendamentos
async function carregarAgendamentosEKpis() {
  try {
    const data = await fetchAdminData('/admin/agendamentos');

    document.getElementById('kpi-total-agendamentos').textContent = data.kpis.totalAgendamentos || 0;
    document.getElementById('kpi-total-clientes').textContent = data.kpis.totalUsuarios || 0;
    document.getElementById('kpi-total-produtos').textContent = data.kpis.totalProdutos || 0;

    const tbody = document.getElementById('all-appointments-tbody');
    tbody.innerHTML = '';

    if (data.agendamentos && data.agendamentos.length > 0) {
      data.agendamentos.forEach(ag => {
        const dataFormatada = new Date(ag.data_agendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const horaFormatada = ag.hora_agendamento.substring(0, 5);
        const statusClasse = ag.status_agendamento?.toLowerCase().replace(/\s+/g, '') || 'desconhecido';
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${ag.nome_cliente || 'N/A'}</td>
                    <td>${ag.email_cliente || 'N/A'}</td>
                    <td>${ag.nome_servico || 'N/A'}</td>
                    <td>${ag.nome_barbeiro || 'N/A'}</td>
                    <td>${dataFormatada}</td>
                    <td>${horaFormatada}</td>
                    <td><span class="status-badge status-${statusClasse}">${ag.status_agendamento}</span></td>
                `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Nenhum agendamento encontrado.</td></tr>';
    }
  } catch (error) {
    document.getElementById('all-appointments-tbody').innerHTML = '<tr><td colspan="7" style="text-align:center;">Erro ao carregar agendamentos.</td></tr>';
  }
}

// Carrega a tabela de produtos
async function carregarProdutosAdmin() {
  try {
    allProducts = await fetchAdminData('/produtos');

    const tbody = document.getElementById('produtos-tbody');
    tbody.innerHTML = '';

    if (allProducts && allProducts.length > 0) {
      allProducts.forEach(prod => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${prod.nome}</td>
                    <td>R$ ${parseFloat(prod.preco).toFixed(2).replace('.', ',')}</td>
                    <td>${prod.estoque}</td>
                    <td class="actions-cell">
                        <button class="btn btn-warning btn-sm btn-editar" data-id="${prod.id}">Editar</button>
                        <button class="btn btn-danger btn-sm btn-excluir" data-id="${prod.id}">Excluir</button>
                    </td>
                `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum produto cadastrado.</td></tr>';
    }

    document.querySelectorAll('.btn-editar').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const produtoParaEditar = allProducts.find(p => p.id == id);
      if (produtoParaEditar) abrirModalProduto(produtoParaEditar);
    }));

    document.querySelectorAll('.btn-excluir').forEach(btn => btn.addEventListener('click', () => {
      handleDeletarProduto(btn.dataset.id);
    }));

  } catch (error) {
    document.getElementById('produtos-tbody').innerHTML = '<tr><td colspan="4" style="text-align:center;">Erro ao carregar produtos.</td></tr>';
  }
}

// Abre o modal para Adicionar ou Editar
function abrirModalProduto(produto = null) {
  const form = document.getElementById('produtoForm');
  const modalTitle = document.getElementById('produtoModalLabel');
  form.reset();

  if (produto) { // Modo Edição
    modalTitle.textContent = 'Editar Produto';
    document.getElementById('produtoId').value = produto.id;
    document.getElementById('produtoNome').value = produto.nome;
    document.getElementById('produtoDescricao').value = produto.descricao;
    document.getElementById('produtoPreco').value = produto.preco;
    document.getElementById('produtoEstoque').value = produto.estoque;
    document.getElementById('produtoImagemUrl').value = produto.imagem_url;
  } else { // Modo Adição
    modalTitle.textContent = 'Adicionar Novo Produto';
    document.getElementById('produtoId').value = '';
  }

  produtoModalInstance.show();
}

// Lida com o submit do formulário de produto
async function handleProdutoFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('produtoId').value;
  const produtoData = {
    nome: document.getElementById('produtoNome').value,
    descricao: document.getElementById('produtoDescricao').value,
    preco: document.getElementById('produtoPreco').value,
    estoque: document.getElementById('produtoEstoque').value,
    imagem_url: document.getElementById('produtoImagemUrl').value,
  };
  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    if (id) {
      await fetchAdminData(`/admin/produtos/${id}`, { method: 'PUT', body: JSON.stringify(produtoData) });
      alert('Produto atualizado com sucesso!');
    } else {
      await fetchAdminData('/admin/produtos', { method: 'POST', body: JSON.stringify(produtoData) });
      alert('Produto adicionado com sucesso!');
    }
    produtoModalInstance.hide();
    carregarDadosDashboard();
  } catch (error) {
    // o alert de erro já é mostrado por fetchAdminData
  } finally {
    submitButton.disabled = false;
  }
}

// Lida com a exclusão de um produto
async function handleDeletarProduto(id) {
  if (confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
    try {
      await fetchAdminData(`/admin/produtos/${id}`, { method: 'DELETE' });
      alert('Produto excluído com sucesso!');
      carregarDadosDashboard();
    } catch (error) {
      // alert de erro já é mostrado
    }
  }
}