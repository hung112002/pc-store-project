// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // <-- Thêm import này

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // <-- State mới để quản lý trạng thái tải

  useEffect(() => {
    setIsLoading(true); // Bắt đầu tải dữ liệu
    const fetchProducts = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/categories`;
const response = await axios.get(apiUrl);
      // Đảm bảo rằng response.data luôn là một mảng
setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error("Không thể tải danh sách sản phẩm!"); // <-- Thông báo lỗi chuyên nghiệp
      } finally {
        setIsLoading(false); // Hoàn thành tải dữ liệu (dù thành công hay thất bại)
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
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
        toast.success("Sản phẩm đã được xóa thành công!"); // <-- Thông báo thành công
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("Xóa sản phẩm thất bại!"); // <-- Thông báo lỗi
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

      {/* --- LOGIC MỚI: HIỂN THỊ LOADING HOẶC BẢNG DỮ LIỆU --- */}
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
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>{product.price.toLocaleString('vi-VN')} VNĐ</td>
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