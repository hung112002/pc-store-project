// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?q=${searchTerm}`);
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error("Không thể tải danh sách sản phẩm!");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (productId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    if (isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
        toast.success("Sản phẩm đã được xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("Xóa sản phẩm thất bại!");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Bảng Điều Khiển Sản Phẩm</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          + Thêm Sản Phẩm Mới
        </Link>
      </div>

      <div className="admin-search-container">
        <input
          type="text"
          className="admin-search-bar"
          placeholder="Tìm sản phẩm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Sản Phẩm</th>
              <th>Thương Hiệu</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Tồn Kho</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand_name}</td>
                <td>{product.category_name}</td>
                {/* --- ĐÂY LÀ DÒNG ĐÃ SỬA LỖI --- */}
                <td>{(product.price || 0).toLocaleString('vi-VN')} VNĐ</td>
                <td>{product.stock_quantity}</td>
                <td className="actions">
                  <Link to={`/admin/products/edit/${product.id}`} className="btn btn-secondary">Sửa</Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-danger"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;