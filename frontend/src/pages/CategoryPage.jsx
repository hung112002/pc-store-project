// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

function CategoryPage() {
  const { categoryName } = useParams(); // Lấy tên category từ URL, ví dụ: "cpu"
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setIsLoading(true);
    const fetchProductsByCategory = async () => {
      try {
        // Gọi API đã được nâng cấp, thêm tham số ?category=...
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/products?category=${categoryName}`;
const response = await axios.get(apiUrl);
// Đảm bảo rằng response.data luôn là một mảng
setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(`Lỗi khi tải sản phẩm cho loại ${categoryName}:`, error);
        toast.error("Không thể tải sản phẩm cho loại này.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryName]); // Chạy lại mỗi khi categoryName trên URL thay đổi

  return (
    <div className="page-container">
      {/* Chuyển chữ "cpu" thành "CPU" */}
      <h1 style={{ textTransform: 'uppercase' }}>{categoryName}</h1>

      {isLoading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;