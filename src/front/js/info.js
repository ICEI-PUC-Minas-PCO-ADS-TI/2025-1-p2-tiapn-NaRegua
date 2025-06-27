// src/front/js/info.js

const API_URL_INFO = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // A lógica do menu de usuário (cabeçalho) pode ser adicionada aqui se necessário
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        carregarDetalhesProduto(productId);
    } else {
        document.getElementById('product-detail-container').innerHTML = '<p class="text-center text-danger">ID do produto não fornecido.</p>';
    }
});

async function carregarDetalhesProduto(id) {
    const container = document.getElementById('product-detail-container');
    const loadingMessage = document.getElementById('loading-produto-detalhe');
    try {
        const response = await fetch(`${API_URL_INFO}/produtos/${id}`);
        if (!response.ok) throw new Error('Produto não encontrado.');
        const produto = await response.json();
        if (loadingMessage) loadingMessage.remove();

        document.title = `NaRégua - ${produto.nome}`;
        container.innerHTML = `
            <div class="product-detail-card p-4 shadow-sm">
                <div class="row">
                    <div class="col-md-5 text-center"><img src="${produto.imagem_url || 'https://i.imgur.com/SgiA4EM.png'}" alt="${produto.nome}" class="img-fluid rounded product-image-detail"></div>
                    <div class="col-md-7 product-info-section">
                        <h1 class="product-name-detail h2 mb-3">${produto.nome}</h1>
                        <p class="product-description-detail text-muted">${produto.descricao || 'Descrição não disponível.'}</p>
                        <hr class="my-4">
                        <div class="mb-3"><span class="fw-bold fs-5">Valor:</span> <span class="product-price-detail fs-4 text-primary fw-bold">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</span></div>
                        <div class="mb-3"><span class="fw-bold fs-5">Disponibilidade:</span> <span class="product-stock-detail fs-5 ${produto.estoque > 0 ? 'text-success' : 'text-danger'} fw-medium">${produto.estoque > 0 ? `${produto.estoque} unidades` : 'Indisponível'}</span></div>
                        <div class="d-flex align-items-center mt-4">
                            <div class="me-3"><label for="quantityInput" class="form-label fw-bold">Quantidade:</label><input type="number" class="form-control quantity-input-detail" id="quantityInput" value="1" min="1" max="${produto.estoque}" ${produto.estoque === 0 ? 'disabled' : ''}></div>
                            <button class="btn btn-success" id="reserveButton" title="Reservar Produto" ${produto.estoque === 0 ? 'disabled' : ''}><i class="fas fa-check-circle me-2"></i>Reservar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        addEventListenersAcoesProduto(produto);
    } catch (error) {
        if (loadingMessage) loadingMessage.remove();
        container.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
    }
}

function addEventListenersAcoesProduto(produto) {
    const reserveButton = document.getElementById('reserveButton');
    const quantityInput = document.getElementById('quantityInput');

    if (reserveButton) {
        reserveButton.addEventListener('click', async () => {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                alert("Você precisa estar logado para reservar produtos.");
                return window.location.href = '../html/login.html';
            }

            const quantidade = parseInt(quantityInput.value);
            if (quantidade <= 0) return alert('Por favor, informe uma quantidade válida.');

            reserveButton.disabled = true;
            reserveButton.innerHTML = 'Reservando...';

            try {
                const resultado = await fetchAPISecuredInfo(`/reservas`, {
                    method: 'POST',
                    body: JSON.stringify({ produtoId: produto.id, quantidade: quantidade })
                });
                alert(resultado.message || 'Produto reservado com sucesso!');
                window.location.href = '../html/meus_agendamentos.html'; // Ou para uma futura página de "minhas reservas"
            } catch (error) {
                alert(`Erro ao reservar: ${error.message}`);
                reserveButton.disabled = false;
                reserveButton.innerHTML = '<i class="fas fa-check-circle me-2"></i> Reservar';
            }
        });
    }
}

// Função de fetch segura, idealmente viria de um utils.js
async function fetchAPISecuredInfo(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) { headers['Authorization'] = `Bearer ${token}`; }
    else { window.location.href = '../html/login.html'; throw new Error("Token não encontrado"); }
    try {
        const response = await fetch(`${API_URL_INFO}${endpoint}`, { ...options, headers });
        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.message || `Erro: ${response.status}`);
        return responseData;
    } catch (error) { console.error(`Erro na API: ${error.message}`); throw error; }
}