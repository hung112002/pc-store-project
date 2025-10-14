// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái tải

  useEffect(() => {
    setIsLoading(true);
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);

        // --- ĐÂY LÀ LỚP BẢO HIỂM QUAN TRỌNG NHẤT ---
        if (Array.isArray(response.data)) {
          setFeaturedProducts(response.data.slice(0, 4)); // Lấy 4 sản phẩm đầu tiên
        } else {
          setFeaturedProducts([]); // Nếu không phải mảng, đặt thành mảng rỗng
        }

      } catch (error) {
        console.error("Lỗi khi tải sản phẩm nổi bật:", error);
        toast.error("Không thể tải các sản phẩm nổi bật.");
        setFeaturedProducts([]); // Đặt thành mảng rỗng nếu có lỗi
      } finally {
        setIsLoading(false);
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
        {isLoading ? (
          <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
        ) : (
          <div className="product-list">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;