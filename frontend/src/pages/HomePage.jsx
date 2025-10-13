
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // Tái sử dụng component ProductCard

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Lấy tất cả sản phẩm và chỉ hiển thị 4 sản phẩm mới nhất làm sản phẩm nổi bật
        const response = await axios.get('http://localhost:5000/api/products');
        setFeaturedProducts(response.data.slice(0, 4)); // Lấy 4 sản phẩm đầu tiên
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm nổi bật:", error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* --- Hero Banner --- */}
      <div className="hero-container">
        <div className="hero-content">
          <h1>BUILD YOUR DREAM PC</h1>
          <p>Linh kiện hàng đầu cho cỗ máy tối thượng của bạn.</p>
          <Link to="/category/gpu" className="btn btn-primary">Khám Phá Ngay</Link>
        </div>
      </div>

      {/* --- Khu vực sản phẩm nổi bật --- */}
      <div className="page-container">
        <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
        <div className="product-list">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;