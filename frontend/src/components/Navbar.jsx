// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
       const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/categories`;
const response = await axios.get(apiUrl);
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FontAwesomeIcon icon={faMicrochip} className="chip-icon" /> 
          PC-STORE
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Trang Chủ
            </Link>
          </li>
          {categories.map(category => (
            <li key={category.id} className="nav-item">
              {/* --- ĐÃ NÂNG CẤP --- */}
              <Link to={`/category/${category.name.toLowerCase()}`} className="nav-links">
                {category.name}
              </Link>
            </li>
          ))}
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