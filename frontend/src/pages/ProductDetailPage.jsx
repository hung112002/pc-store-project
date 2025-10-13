// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Hàm để chuyển đổi link YouTube thường thành link nhúng
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (error) {
    return null;
  }
};

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        }
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="page-container">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(product.video_url);

  return (
    <div className="page-container">
      <div className="product-detail">
        <Link to="/" className="back-link">← Quay lại danh sách</Link>
        <h1>{product.name}</h1>

        <div className="product-detail-layout">
          <div className="product-detail-media">
            <img
              src={product.image_url || 'https://via.placeholder.com/800x600.png?text=No+Image'}
              alt={product.name}
              className="product-detail-image"
            />
          </div>
          <div className="product-detail-info">
            <p className="brand">Thương hiệu: {product.brand_name}</p>
            <p className="category">Loại: {product.category_name}</p>
            <p className="price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
            <p>Số lượng trong kho: {product.stock_quantity}</p>
            <div className="description">
              <h3>Mô tả chi tiết:</h3>
              <p>{product.description || "Sản phẩm này chưa có mô tả."}</p>
            </div>
          </div>
        </div>

        {/* --- HIỂN THỊ VIDEO TRAILER NẾU CÓ --- */}
        {embedUrl && (
          <div className="video-container">
            <h3>Video Trailer</h3>
            <iframe
              src={embedUrl}
              title={product.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;