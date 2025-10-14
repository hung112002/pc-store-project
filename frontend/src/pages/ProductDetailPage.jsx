// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [isLoading, setIsLoading] = useState(true); // <-- Thêm state loading
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setIsLoading(true);
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`${API_URL}/api/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
          toast.error("Không tìm thấy sản phẩm hoặc có lỗi xảy ra.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    const timer = setTimeout(() => {
      fetchProduct();
    }, 500); // Đợi 0.5 giây

    return () => clearTimeout(timer); // Cleanup timer
  }, [id, API_URL]);

  // --- LOGIC MỚI: Xử lý trạng thái tải ---
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Nếu không tìm thấy sản phẩm sau khi tải xong
  if (!product) {
    return (
      <div className="page-container">
        <h1>Không tìm thấy sản phẩm</h1>
        <Link to="/" className="back-link">← Quay lại trang chủ</Link>
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
            <p className="price">{(product.price || 0).toLocaleString('vi-VN')} VNĐ</p>
            <p>Số lượng trong kho: {product.stock_quantity}</p>
            <div className="description">
              <h3>Mô tả chi tiết:</h3>
              <p>{product.description || "Sản phẩm này chưa có mô tả."}</p>
            </div>
          </div>
        </div>
        
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