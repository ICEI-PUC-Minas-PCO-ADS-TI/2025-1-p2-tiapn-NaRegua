// src/front/js/produtos.js

const API_URL_PRODUTOS = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para o menu de usuário (pode ser movida para um utils.js no futuro)
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userMenuContainer = document.getElementById('userMenuContainer');

    if (authToken && userMenuContainer) {
        const userDropdownToggle = userMenuContainer.querySelector('#navbarUserDropdown');
        const logoutBtn = userMenuContainer.querySelector('#logoutButton');
        const deleteAccountBtn = userMenuContainer.querySelector('#deleteAccountButton');

        if (userDropdownToggle && userName) {
            userDropdownToggle.textContent = `Olá, ${userName}`;
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = '../html/login.html';
            });
        }
        if (deleteAccountBtn) {
            // A função handleDeleteAccount precisaria ser definida ou importada
        }
    } else {
        // Lógica para usuário não logado, se necessário
    }

    // Função principal para carregar os produtos
    carregarProdutos();
});

async function carregarProdutos() {
    const listaProdutosDiv = document.getElementById('lista-produtos');
    const loadingMessage = document.getElementById('loading-produtos');

    try {
        const response = await fetch(`${API_URL_PRODUTOS}/produtos`);
        if (!response.ok) {
            throw new Error('Não foi possível carregar os produtos.');
        }
        const produtos = await response.json();

        if (loadingMessage) loadingMessage.style.display = 'none';
        listaProdutosDiv.innerHTML = ''; // Limpa a mensagem de carregamento

        if (produtos && produtos.length > 0) {
            produtos.forEach(produto => {
                const precoFormatado = parseFloat(produto.preco).toFixed(2).replace('.', ',');

                // Cria o card do produto
                const card = document.createElement('div');
                card.className = 'col-lg-3 col-md-4 col-sm-6';
                card.innerHTML = `
                    <a href="InfoProdutos.html?id=${produto.id}" class="text-decoration-none">
                        <div class="card product-card h-100">
                            <img src="${produto.imagem_url || 'https://i.imgur.com/SgiA4EM.png'}" class="product-card-img-top" alt="${produto.nome}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${produto.nome}</h5>
                                <p class="card-price mt-auto">R$ ${precoFormatado}</p>
                            </div>
                        </div>
                    </a>
                `;
                listaProdutosDiv.appendChild(card);
            });
        } else {
            listaProdutosDiv.innerHTML = '<p class="text-center col-12">Nenhum produto disponível no momento.</p>';
        }

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        if (loadingMessage) loadingMessage.style.display = 'none';
        listaProdutosDiv.innerHTML = `<p class="text-center col-12 text-danger">Erro ao carregar produtos. Tente novamente mais tarde.</p>`;
    }
}