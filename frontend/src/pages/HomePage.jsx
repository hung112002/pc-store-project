// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategoryHighlight from '../components/CategoryHighlight'; 
import BrandShowcase from '../components/BrandShowcase'; 
import { toast } from 'react-toastify';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pcCases, setPcCases] = useState([]); // State cho PC Case
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingCases, setIsLoadingCases] = useState(true); // State loading cho PC Case
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Thêm fallback cho local

  // Lấy sản phẩm nổi bật (4 sản phẩm đầu)
  useEffect(() => {
    setIsLoadingProducts(true);
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        if (Array.isArray(response.data)) {
          setFeaturedProducts(response.data.slice(0, 4));
        } else { setFeaturedProducts([]); }
      } catch (error) {
        toast.error("Không thể tải sản phẩm nổi bật.");
        setFeaturedProducts([]);
      } finally { setIsLoadingProducts(false); }
    };
    fetchFeaturedProducts();
  }, [API_URL]);

  // Lấy categories (4 category đầu)
  useEffect(() => {
    setIsLoadingCategories(true);
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/categories`);
            setCategories(Array.isArray(response.data) ? response.data.slice(0, 4) : []);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            setCategories([]);
        } finally { setIsLoadingCategories(false); }
    };
    fetchCategories();
  }, [API_URL]);

  // Lấy PC Cases (4 case đầu)
  useEffect(() => {
    setIsLoadingCases(true);
    const fetchPcCases = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/products?category=PC Case`);
            if (Array.isArray(response.data)) {
                setPcCases(response.data.slice(0, 4));
            } else { setPcCases([]); }
        } catch (error) {
            console.error("Lỗi khi tải PC Cases:", error);
            setPcCases([]);
        } finally { setIsLoadingCases(false); }
    };
    fetchPcCases();
  }, [API_URL]);


  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-container">
        <div className="hero-content"><h1>BUILD YOUR DREAM PC</h1><p>Linh kiện hàng đầu cho cỗ máy tối thượng của bạn.</p><Link to="/category/gpu" className="btn btn-primary">Khám Phá Ngay</Link></div>
      </div>

      {/* ============================================== */}
      {/* ===    KHU VỰC DANH MỤC ĐÃ BỔ SUNG       === */}
      {/* ============================================== */}
      <div className="page-container category-highlights-section">
        <h2 className="section-title">Mặt Hàng Nổi Bật</h2>
        {isLoadingCategories ? (
            <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
        ) : (
            <div className="category-highlights-grid">
                {categories.map(cat => (
                    <CategoryHighlight key={cat.id} category={cat} />
                ))}
            </div>
        )}
      </div>

      {/* Sản Phẩm Mới Nhất */}
      <div className="page-container featured-products-section">
        <h2 className="section-title">Sản Phẩm Mới Nhất</h2>
        {isLoadingProducts ? (<div className="loading-spinner-container"><div className="loading-spinner"></div></div>) : (
          <div className="product-list">
            {featuredProducts.map(product => (<ProductCard key={product.id} product={product} />))}
          </div>
        )}
      </div>

      {/* Thương Hiệu Nổi Bật */}
      <BrandShowcase />

    
      <div className="page-container pc-case-section">
         <h2 className="section-title">Case PC </h2>
         {isLoadingCases ? (
             <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
         ) : (
             <div className="product-list">
                 {pcCases.map(product => (
                     <ProductCard key={product.id} product={product} />
                 ))}
             </div>
         )}
      </div>

    </div>
  );
}
export default HomePage;