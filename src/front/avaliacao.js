document.addEventListener('DOMContentLoaded', () => {
    const ratingContainers = document.querySelectorAll('.product-rating');

    const messageTimeouts = {};

    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const productId = container.id;

        let messageElement = container.querySelector('.rating-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.classList.add('rating-message');
            container.appendChild(messageElement);
        }

        const showMessage = (msg) => {
            if (messageTimeouts[productId]) {
                clearTimeout(messageTimeouts[productId]);
            }

            messageElement.textContent = msg;
            messageElement.style.opacity = '1';
            messageElement.style.transition = 'opacity 0.5s ease-in-out';

            messageTimeouts[productId] = setTimeout(() => {
                messageElement.style.opacity = '0';
                messageElement.textContent = '';
            }, 3000);
        };

        const updateStars = (rating) => {
            stars.forEach(star => {
                if (parseInt(star.dataset.value) <= rating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        };

        let currentRating = localStorage.getItem(productId) ? parseInt(localStorage.getItem(productId)) : 0;
        updateStars(currentRating);

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const clickedRating = parseInt(star.dataset.value);
                let message = '';

                if (clickedRating === currentRating) {
                    currentRating = 0;
                    message = 'Avaliação removida!';
                } else {
                    currentRating = clickedRating;
                    message = `Avaliação de ${currentRating} estrelas!`;
                }

                updateStars(currentRating);
                localStorage.setItem(productId, currentRating);
                showMessage(message);
            });

            star.addEventListener('mouseover', () => {
                const hoverRating = parseInt(star.dataset.value);
                stars.forEach(s => {
                    if (parseInt(s.dataset.value) <= hoverRating) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
            });

            star.addEventListener('mouseout', () => {
                updateStars(currentRating);
            });
        });
    });
});