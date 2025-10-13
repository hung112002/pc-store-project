// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Cấu hình kết nối
const connectionConfig = {
  // Nếu đang ở môi trường production (trên Render), dùng DATABASE_URL
  connectionString: process.env.DATABASE_URL,
  // Render yêu cầu kết nối SSL
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

// Nếu không ở production (đang chạy ở máy bạn), dùng các biến từ file .env
if (!isProduction) {
  connectionConfig.user = process.env.DB_USER;
  connectionConfig.host = process.env.DB_HOST;
  connectionConfig.database = process.env.DB_DATABASE;
  connectionConfig.password = process.env.DB_PASSWORD;
  connectionConfig.port = process.env.DB_PORT;
}

const pool = new Pool(connectionConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};