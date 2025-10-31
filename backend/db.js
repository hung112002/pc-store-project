// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let connectionConfig;

if (isProduction) {
  // --- CẤU HÌNH CHO INTERNET (Render) ---
  // Chỉ sử dụng DATABASE_URL mà bạn đã thiết lập trên Render
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
} else {
  // --- CẤU HÌNH CHO MÁY BẠN (Local) ---
  // Chỉ sử dụng các biến trong file .env
  connectionConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, // Sẽ đọc đúng cổng 1322
  };
}

// Tạo pool kết nối MỘT LẦN DUY NHẤT
const pool = new Pool(connectionConfig);

// Xuất ra cả hàm query (cho lệnh GET) và pool (cho lệnh POST/PUT)
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool 
};