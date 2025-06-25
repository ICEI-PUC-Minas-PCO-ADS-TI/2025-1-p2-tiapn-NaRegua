import React, { useState, useEffect } from 'react';

function Rating({ productId }) {
    const [averageRating, setAverageRating] = useState(0);
    const [message, setMessage] = useState('');
    const [messageTimeoutId, setMessageTimeoutId] = useState(null);
    const [hoverRating, setHoverRating] = useState(0); 

    
    const loadRatingsFromLocalStorage = () => {
        try {
            const storedRatings = localStorage.getItem('productRatings');
            return storedRatings ? JSON.parse(storedRatings) : {};
        } catch (error) {
            console.error("Erro ao carregar avaliações do localStorage:", error);
            return {};
        }
    };

    const saveRatingsToLocalStorage = (ratings) => {
        try {
            localStorage.setItem('productRatings', JSON.stringify(ratings));
        } catch (error) {
            console.error("Erro ao salvar avaliações no localStorage:", error);
        }
    };

    const calculateAverage = (ratingsArray) => {
        if (ratingsArray.length === 0) return 0;
        const sum = ratingsArray.reduce((acc, rating) => acc + rating, 0);
        return (sum / ratingsArray.length);
    };

    
    const showMessage = (msg) => {
        setMessage(msg);
        if (messageTimeoutId) {
            clearTimeout(messageTimeoutId);
        }
        const id = setTimeout(() => {
            setMessage('');
        }, 3000);
        setMessageTimeoutId(id);
    };

    
    useEffect(() => {
        const allRatings = loadRatingsFromLocalStorage();
        const currentProductRatings = allRatings[productId] || [];
        const avg = calculateAverage(currentProductRatings);
        setAverageRating(parseFloat(avg.toFixed(1)));
    }, [productId]);

    
    const handleStarClick = (clickedRating) => {
        const allRatings = loadRatingsFromLocalStorage();
        const currentProductRatings = allRatings[productId] || [];

        currentProductRatings.push(clickedRating);
        allRatings[productId] = currentProductRatings;

        saveRatingsToLocalStorage(allRatings);

        const newAvg = calculateAverage(currentProductRatings);
        setAverageRating(parseFloat(newAvg.toFixed(1)));

        showMessage('Avaliação submetida com sucesso!');
    };


    const renderStars = () => {
        const stars = [];
        
        const displayRating = hoverRating || Math.round(averageRating);

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`bi bi-star-fill star ${i <= displayRating ? 'selected' : ''}`}
                    data-value={i}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => setHoverRating(i)} 
                    onMouseLeave={() => setHoverRating(0)}
                ></i>
            );
        }
        return stars;
    };

    return (
        <div className="product-rating" id={productId}>
            {renderStars()}
            <span className="average-rating-display"> ({averageRating.toFixed(1)})</span>
            {message && <div className="rating-message" style={{ opacity: 1 }}>{message}</div>}
        </div>
    );
}

export default Rating;