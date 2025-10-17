// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL; // <-- Đọc địa chỉ từ "sổ tay"

  useEffect(() => {
    setIsLoading(true);
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`); // <-- Dùng địa chỉ mới
        if (Array.isArray(response.data)) {
          setFeaturedProducts(response.data.slice(0, 4));
        } else { setFeaturedProducts([]); }
      } catch (error) {
        toast.error("Không thể tải các sản phẩm nổi bật.");
        setFeaturedProducts([]);
      } finally { setIsLoading(false); }
    };
    fetchFeaturedProducts();
  }, [API_URL]); // Thêm API_URL vào dependency array

  return (
    // Giao diện không thay đổi
    <div>
      <div className="hero-container">
        <div className="hero-content"><h1>BUILD YOUR DREAM PC</h1><p>Linh kiện hàng đầu cho cỗ máy tối thượng của bạn.</p><Link to="/category/gpu" className="btn btn-primary">Khám Phá Ngay</Link></div>
      </div>
      <div className="page-container">
        <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
        {isLoading ? (<div className="loading-spinner-container"><div className="loading-spinner"></div></div>) : (
          <div className="product-list">
            {featuredProducts.map(product => (<ProductCard key={product.id} product={product} />))}
          </div>
        )}
      </div>
    </div>
  );
}
export default HomePage;