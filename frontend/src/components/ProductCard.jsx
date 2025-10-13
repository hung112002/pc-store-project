// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-link">
      <div className="product-card">
        <img
          src={product.image_url || 'https://via.placeholder.com/400x300.png?text=No+Image'}
          alt={product.name}
          className="product-card-image"
        />
        <div className="product-card-info">
          <h2>{product.name}</h2>
          <p>Thương hiệu: {product.brand_name}</p>
          <p className="product-card-price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;