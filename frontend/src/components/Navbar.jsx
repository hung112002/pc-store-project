// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [categories, setCategories] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories`);
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, [API_URL]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Menu bên trái */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Trang Chủ
            </Link>
          </li>
          {categories.map(category => (
            <li key={category.id} className="nav-item">
              <Link to={`/category/${category.name.toLowerCase()}`} className="nav-links">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logo ở giữa (được định vị tuyệt đối bằng CSS) */}
        <Link to="/" className="navbar-logo">
          <FontAwesomeIcon icon={faMicrochip} className="chip-icon" />
          PC-STORE
        </Link>

        {/* Menu bên phải (chỉ có nút Admin) */}
        <ul className="nav-menu">
           <li className="nav-item">
            <Link to="/admin" className="nav-links admin-link">
              Quản Trị
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;