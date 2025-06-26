// src/front/js/info.js

const API_URL_INFO = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para o menu de usuário (pode ser movida para um utils.js no futuro)
    // ... (copie a mesma lógica de usuário logado do produtos.js se quiser o header aqui)

    // Pega o ID do produto da URL (ex: InfoProdutos.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        carregarDetalhesProduto(productId);
    } else {
        const container = document.getElementById('product-detail-container');
        container.innerHTML = '<p class="text-center text-danger">ID do produto não fornecido.</p>';
    }
});

async function carregarDetalhesProduto(id) {
    const container = document.getElementById('product-detail-container');
    const loadingMessage = document.getElementById('loading-produto-detalhe');

    try {
        const response = await fetch(`${API_URL_INFO}/produtos/${id}`);
        if (!response.ok) {
            throw new Error('Produto não encontrado.');
        }
        const produto = await response.json();

        if (loadingMessage) loadingMessage.style.display = 'none';

        const precoFormatado = parseFloat(produto.preco).toFixed(2).replace('.', ',');
        const estoqueTexto = produto.estoque > 0 ? `${produto.estoque} unidades em estoque` : 'Produto indisponível';
        const estoqueCor = produto.estoque > 0 ? 'text-success' : 'text-danger';

        // Atualiza o título da página
        document.title = `NaRégua - ${produto.nome}`;

        // Insere o HTML dinâmico no container
        container.innerHTML = `
            <div class="product-detail-card p-4 shadow-sm">
                <div class="row">
                    <div class="col-md-5 text-center product-image-container">
                        <img src="${produto.imagem_url || 'https://i.imgur.com/SgiA4EM.png'}" alt="${produto.nome}" class="img-fluid rounded product-image-detail mb-3 mb-md-0">
                        <button class="btn favorite-icon-detail" id="favoriteButton" title="Favoritar">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>

                    <div class="col-md-7 product-info-section">
                        <h1 class="product-name-detail h2 mb-3">${produto.nome}</h1>
                        <p class="product-description-detail text-muted">${produto.descricao || 'Descrição não disponível.'}</p>
                        <hr class="my-4">
                        <div class="mb-3">
                            <span class="fw-bold fs-5">Valor:</span>
                            <span class="product-price-detail fs-4 text-primary fw-bold">R$ ${precoFormatado}</span>
                        </div>
                        <div class="mb-3">
                            <span class="fw-bold fs-5">Disponibilidade:</span>
                            <span class="product-stock-detail fs-5 ${estoqueCor} fw-medium">${estoqueTexto}</span>
                        </div>
                        <div class="d-flex align-items-center mt-4">
                            <div class="me-3">
                                <label for="quantityInput" class="form-label fw-bold">Quantidade:</label>
                                <input type="number" class="form-control quantity-input-detail" id="quantityInput" value="1" min="1" max="${produto.estoque}" ${produto.estoque === 0 ? 'disabled' : ''}>
                            </div>
                            <button class="btn btn-success add-to-cart-icon-detail" id="addToCartButton" title="Adicionar ao Carrinho" ${produto.estoque === 0 ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart me-2"></i> Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Re-adiciona os event listeners aos botões que acabaram de ser criados
        addEventListenersAcoesProduto(produto);

    } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
        if (loadingMessage) loadingMessage.style.display = 'none';
        container.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
    }
}

function addEventListenersAcoesProduto(produto) {
    let isFavorited = false; // Lógica de favorito ainda é simulada
    const favoriteButton = document.getElementById('favoriteButton');
    const quantityInput = document.getElementById('quantityInput');
    const addToCartButton = document.getElementById('addToCartButton');

    if (favoriteButton) {
        favoriteButton.addEventListener('click', () => {
            isFavorited = !isFavorited;
            favoriteButton.classList.toggle('favorited');
            const icon = favoriteButton.querySelector('i');
            if (isFavorited) {
                icon.classList.replace('far', 'fas');
                alert(`"${produto.nome}" adicionado aos favoritos! (simulação)`);
            } else {
                icon.classList.replace('fas', 'far');
                alert(`"${produto.nome}" removido dos favoritos! (simulação)`);
            }
        });
    }

    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                alert(`${quantity}x "${produto.nome}" adicionado(s) ao carrinho! (simulação)`);
                // Lógica real do carrinho viria aqui
            }
        });
    }
}