// src/pages/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ProductForm() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productData, setProductData] = useState({
    name: '', description: '', price: '', stock_quantity: '',
    category_id: '', brand_id: '', image_url: '', video_url: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Lấy API base URL từ biến môi trường
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/brands`),
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (error) { toast.error("Không thể tải dữ liệu cho form!"); }
    };
    fetchDropdownData();
  }, [API_URL]);

  useEffect(() => {
    if (isEditing) {
      const fetchProductForEdit = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/products/${id}`);
          setProductData({ ...response.data, category_id: response.data.category_id || '', brand_id: response.data.brand_id || '' });
        } catch (error) { toast.error("Không thể tải dữ liệu sản phẩm!"); }
      };
      fetchProductForEdit();
    }
  }, [id, isEditing, API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/products/${id}`, productData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post(`${API_URL}/api/products`, productData);
        toast.success("Tạo sản phẩm mới thành công!");
      }
      navigate('/admin');
    } catch (error) { toast.error("Lưu sản phẩm thất bại."); }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{isEditing ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h1>
        <Link to="/admin" className="btn btn-secondary">Hủy</Link>
      </div>
      <form className="product-form" onSubmit={handleSubmit}>
        {/* Các trường input không thay đổi */}
        <div className="form-group"><label htmlFor="name">Tên sản phẩm</label><input type="text" id="name" name="name" value={productData.name} onChange={handleInputChange} required /></div>
        <div className="form-group"><label htmlFor="description">Mô tả</label><textarea id="description" name="description" rows="5" value={productData.description || ''} onChange={handleInputChange}></textarea></div>
        <div className="form-row"><div className="form-group"><label htmlFor="price">Giá</label><input type="number" id="price" name="price" value={productData.price} onChange={handleInputChange} required /></div><div className="form-group"><label htmlFor="stock_quantity">Số lượng tồn kho</label><input type="number" id="stock_quantity" name="stock_quantity" value={productData.stock_quantity || ''} onChange={handleInputChange} /></div></div>
        <div className="form-row"><div className="form-group"><label htmlFor="category_id">Loại sản phẩm</label><select id="category_id" name="category_id" value={productData.category_id} onChange={handleInputChange} required><option value="" disabled>-- Chọn loại --</option>{categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</select></div><div className="form-group"><label htmlFor="brand_id">Thương hiệu</label><select id="brand_id" name="brand_id" value={productData.brand_id} onChange={handleInputChange} required><option value="" disabled>-- Chọn thương hiệu --</option>{brands.map(brand => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}</select></div></div>
        <div className="form-group"><label htmlFor="image_url">URL Hình ảnh</label><input type="text" id="image_url" name="image_url" value={productData.image_url || ''} onChange={handleInputChange} /></div>
        <div className="form-group"><label htmlFor="video_url">URL Video Trailer (YouTube)</label><input type="text" id="video_url" name="video_url" value={productData.video_url || ''} onChange={handleInputChange} /></div>
        <div className="form-actions"><button type="submit" className="btn btn-primary">{isEditing ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm'}</button></div>
      </form>
    </div>
  );
}

export default ProductForm;