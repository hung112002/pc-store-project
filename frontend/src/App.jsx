// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductForm from './pages/ProductForm';
import CategoryPage from './pages/CategoryPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Luôn hiển thị ở trên cùng */}
      <main className="main-content"> {/* Thêm thẻ main để bao bọc nội dung */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
      </main>
      <Footer /> {/* Luôn hiển thị ở dưới cùng, bên ngoài Routes */}
      <ToastContainer position="bottom-right" theme="dark" />
    </BrowserRouter>
  );
}
// Trigger new deploy on Vercel

export default App;