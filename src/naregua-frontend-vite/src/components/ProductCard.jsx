import React from 'react';
import Rating from './Rating.jsx';

function ProductCard({ product }) {
  const isShirt = product.category === 'camisa'; 

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
      <div className="card w-100">
        {}
        <img src={product.image} className={`card-img-top ${isShirt ? 'camisa' : ''}`} alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          {}
          <Rating productId={product.id} />
          <a href="Proxima.html" className="btn btn-primary mt-auto">Saiba mais</a>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;