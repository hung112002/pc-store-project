// src/pages/ProductListPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // <-- State mới

  useEffect(() => {
    setIsLoading(true); // Bắt đầu tải
    const fetchProducts = async () => {
      try {
   const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/products?q=${searchTerm}`;
const response = await axios.get(apiUrl);
         setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error("Không thể tải sản phẩm. Vui lòng thử lại sau!"); 
      } finally {
        setIsLoading(false); // Kết thúc tải
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="page-container">
      <h1>Danh sách Linh kiện PC</h1>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Tìm kiếm theo tên sản phẩm (ví dụ: RTX, Core i9...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- LOGIC MỚI: HIỂN THỊ LOADING HOẶC DANH SÁCH SẢN PHẨM --- */}
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

export default ProductListPage;