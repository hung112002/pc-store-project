
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo-section">
          <Link to="/" className="footer-logo">
            <FontAwesomeIcon icon={faMicrochip} className="chip-icon" />
            PC-STORE
          </Link>
          <p className="footer-tagline">Your Ultimate PC Parts Destination.</p>
        </div>
        <div className="footer-links-section">
          <h4>Sản Phẩm</h4>
          <Link to="/category/cpu" className="footer-link">CPU</Link>
          <Link to="/category/gpu" className="footer-link">GPU</Link>
          <Link to="/category/ram" className="footer-link">RAM</Link>
          <Link to="/category/mainboard" className="footer-link">Mainboard</Link>
        </div>
        <div className="footer-links-section">
          <h4>Hỗ Trợ</h4>
          <a href="#" className="footer-link">Liên Hệ</a>
          <a href="#" className="footer-link">Chính Sách Bảo Hành</a>
          <a href="#" className="footer-link">Câu Hỏi Thường Gặp</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 PC-STORE. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;