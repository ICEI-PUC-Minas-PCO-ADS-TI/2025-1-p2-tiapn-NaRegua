document.addEventListener('DOMContentLoaded', () => {
    // Simulação de dados do produto (em um cenário real, isso poderia vir de um backend ou URL)
    // Para este exemplo, vamos pegar alguns dados do HTML e definir um ID fixo.
    const productId = 'gel-fixador-001'; // Um ID de produto exemplo
    let isFavorited = false; // Estado inicial do favorito

    const favoriteButton = document.getElementById('favoriteButton');
    const quantityInput = document.getElementById('quantityInput');
    const addToCartButton = document.getElementById('addToCartButton');

    const productNameElement = document.querySelector('.product-name-detail');
    const productPriceElement = document.querySelector('.product-price-detail');
    const productStockElement = document.querySelector('.product-stock-detail');

    // Define o máximo do input de quantidade com base no estoque visível
    if (productStockElement && quantityInput) {
        const stockText = productStockElement.textContent || "0"; // "15 unidades"
        const stockValue = parseInt(stockText.split(" ")[0]);
        if (!isNaN(stockValue) && stockValue > 0) {
            quantityInput.max = stockValue;
        } else {
            quantityInput.max = 1; // Default se não conseguir ler o estoque
        }
    }


    // Função para Favoritar
    if (favoriteButton) {
        favoriteButton.addEventListener('click', () => {
            isFavorited = !isFavorited;
            favoriteButton.classList.toggle('favorited');
            const icon = favoriteButton.querySelector('i');
            if (isFavorited) {
                icon.classList.remove('far'); // Remove ícone de contorno
                icon.classList.add('fas');    // Adiciona ícone preenchido
                console.log(`Produto ${productId} adicionado aos favoritos.`);
                alert('Produto adicionado aos favoritos!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                console.log(`Produto ${productId} removido dos favoritos.`);
                alert('Produto removido dos favoritos!');
            }
        });
    }

    // Função para Adicionar ao Carrinho
    if (addToCartButton && quantityInput && productNameElement && productPriceElement) {
        addToCartButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            const productName = productNameElement.textContent;
            const productPriceText = productPriceElement.textContent.replace('R$ ', '').replace(',', '.');
            const productPrice = parseFloat(productPriceText);

            if (quantity > 0) {
                console.log('Adicionado ao carrinho:', {
                    id: productId,
                    nome: productName,
                    preco: productPrice,
                    quantidade: quantity
                });
                alert(`${quantity}x ${productName} (R$ ${productPrice.toFixed(2).replace('.',',')}) adicionado(s) ao carrinho!`);
                // Aqui você implementaria a lógica real do carrinho
                // (ex: adicionar a um array, localStorage, enviar para backend)
            } else {
                alert('Por favor, informe uma quantidade válida.');
            }
        });
    }
});