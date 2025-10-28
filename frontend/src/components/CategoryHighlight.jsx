// src/components/CategoryHighlight.jsx
import React from 'react';
import { Link } from 'react-router-dom';
const categoryImages = {
  CPU: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ4lLSsHlR1w5ilBmUnaEHLDQChyxXfFhGuuc3Gk4iuQD49HucbQW_mt54lZRspSUZ22k6Qbhw3ce4zGv9uH-A5_KbBCIqJUZWHzag71tpKWOxU5uNIFu01',
  GPU: 'https://www.dateks.lv/images/pic/1200/1200/421/1954.jpg',
  Mainboard: 'https://s.alicdn.com/@sc04/kf/Hc20780f7c248444da030926736e5cfadp.jpg_321x321.jpg',
  RAM: 'https://hanoicomputercdn.com/media/lib/09-08-2023/ram.png',
  PSU: 'https://hanoicomputercdn.com/media/lib/09-08-2023/nguon.png',
  Monitor: 'https://m.media-amazon.com/images/I/91BPFUV2EIL._AC_UF1000,1000_QL80_.jpg',
  'PC Case': 'https://hanoicomputercdn.com/media/lib/09-08-2023/vo-case.png', // Thêm ảnh cho PC Case
  'Pre-built PC': 'https://hanoicomputercdn.com/media/lib/31-10-2022/may-dong-bo.svg', // Thêm ảnh cho PC ráp sẵn
  // Thêm các loại khác nếu cần
};
// Ảnh mặc định nếu không tìm thấy
const defaultImageUrl = 'https://via.placeholder.com/300x200.png?text=Category';

// Component CategoryHighlight nhận vào một đối tượng 'category'
function CategoryHighlight({ category }) {
  // Lấy link ảnh tương ứng hoặc dùng ảnh mặc định
  const imageUrl = categoryImages[category.name] || defaultImageUrl;

  return (
    <Link to={`/category/${category.name.toLowerCase()}`} className="category-highlight-card fade-in">
      <img src={imageUrl} alt={category.name} />
      <h3>{category.name}</h3>
    </Link>
  );
}

export default CategoryHighlight;