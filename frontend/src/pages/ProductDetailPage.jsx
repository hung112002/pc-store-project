// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SpecTable = ({ specs, category }) => {
  if (!specs) return null;

  const specMap = {
    CPU: {
      socket: "Socket",
      total_cores: "Tổng số nhân",
      p_cores: "Số nhân P-core",
      e_cores: "Số nhân E-core",
      total_threads: "Tổng số luồng",
      max_turbo_frequency: "Tần số Turbo tối đa",
      cache: "Bộ nhớ đệm",
      integrated_graphics: "Đồ họa tích hợp",
    },
    GPU: {
      graphics_engine: "Nhân đồ họa",
      vram: "Bộ nhớ VRAM",
      cuda_cores: "Số nhân CUDA",
      boost_clock: "Xung nhịp (OC)",
      memory_interface: "Giao diện bộ nhớ",
      display_outputs: "Cổng xuất hình",
      power_connectors: "Đầu cấp nguồn",
      recommended_psu: "Nguồn đề xuất",
      第4世代: "第4世代",
      Maximum_resolution: "最大解像度",
    },
    RAM: {
      type: "Loại RAM",
      capacity: "Dung lượng",
      speed: "Tốc độ Bus",
      cas_latency: "Độ trễ (CAS)",
    },
    Mainboard: {
      socket: "Socket",
      chipset: "Chipset",
      form_factor: "Kích thước",
      memory_slots: "Khe RAM",
      pcie_slot: "PCIeスロット",
      max_memory: "最大メモリ",
      Graphics: "グラフィック",
      Operating_system : "オペレーティング·システム",
      Intel_generation_ssupport :"Intel_generation_ssupport",
      wifi:"Wifi",

    },
    Monitor: {
      screen_size: "Kích thước màn hình",
      resolution: "Độ phân giải",
      panel_type: "パネル種類",
      refresh_rate: "リフレッシュレート",
      response_time: "Thời gian phản hồi",
      ports: "Cổng kết nối",
    },
    PSU: {
      wattage: "Công suất",
      efficiency_rating: "Chứng nhận hiệu suất",
      form_factor: "Kích thước (Form Factor)",
      modularity: "Module",
      fan_size: "Kích thước quạt",
    },
  };

  const relevantSpecs = specMap[category] || {};
  const specKeys = Object.keys(relevantSpecs);

  if (specKeys.length === 0) return null;

  return (
    <div className="spec-table">
      <h3>Thông Số Kỹ Thuật Chi Tiết</h3>
      <table>
        <tbody>
          {specKeys.map(key => (
            specs[key] && (
              <tr key={key}>
                <td>{relevantSpecs[key]}</td>
                <td>{specs[key]}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};


const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (error) {
    return null;
  }
};


function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    // Code tải dữ liệu giữ nguyên, không thay đổi
    setIsLoading(true);
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`${API_URL}/api/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          toast.error("Không tìm thấy sản phẩm hoặc có lỗi xảy ra.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  if (isLoading) {
    return <div className="page-container"><div className="loading-spinner-container"><div className="loading-spinner"></div></div></div>;
  }
  if (!product) {
    return <div className="page-container"><h1>Không tìm thấy sản phẩm</h1><Link to="/" className="back-link">← Quay lại trang chủ</Link></div>;
  }

  const embedUrl = getYouTubeEmbedUrl(product.video_url);

  return (
    <div className="page-container">
      <div className="product-detail">
        <Link to="/" className="back-link">← Quay lại danh sách</Link>
        <h1>{product.name}</h1>
        <div className="product-detail-layout">
          <div className="product-detail-media">
            <img src={product.image_url || 'https://via.placeholder.com/800x600.png?text=No+Image'} alt={product.name} className="product-detail-image"/>
            <div className="image-gallery">
              {product.images && product.images.map(img => (
                <img key={img.id} src={img.image_url} alt={product.name} />
              ))}
            </div>
          </div>
          <div className="product-detail-info">
            <p className="brand">Thương hiệu: {product.brand_name}</p>
            <p className="category">Loại: {product.category_name}</p>
            <p className="price">{(product.price || 0).toLocaleString('vi-VN')} VNĐ</p>
            <p>Số lượng trong kho: {product.stock_quantity}</p>
            <div className="description">
              <h3>Mô tả chi tiết:</h3>
              <p>{product.description || "Sản phẩm này chưa có mô tả."}</p>
            </div>
            {/* HIỂN THỊ BẢNG THÔNG SỐ "THÔNG MINH" */}
            <SpecTable specs={product.specifications} category={product.category_name} />
          </div>
        </div>
        {embedUrl && (
          <div className="video-container">
            <h3>Video Trailer</h3>
            <iframe src={embedUrl} title={product.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;