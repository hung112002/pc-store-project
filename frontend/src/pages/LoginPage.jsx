// src/pages/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Dùng Link để quay về trang chủ

function LoginPage() {
  return (
    // Sử dụng lại "admin-container" để có nền tối và căn giữa
    <div className="admin-container">
      <form className="login-form">
        <h2>Đăng Nhập Quản Trị</h2>
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input type="text" id="username" name="username" placeholder="admin" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input type="password" id="password" name="password" placeholder="••••••••" />
        </div>
        {/* Nút đăng nhập bây giờ là một thẻ Link để chuyển trang (tạm thời) */}
        <Link to="/admin" className="btn btn-primary login-button">
          Đăng Nhập
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;