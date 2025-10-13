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

  useEffect(() => {
    setIsLoading(true);
    const fetchProductsByCategory = async () => {
      try {
        // Gọi API đã được nâng cấp, thêm tham số ?category=...
        const response = await axios.get(`http://localhost:5000/api/products?category=${categoryName}`);
        setProducts(response.data);
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