// src/components/BrandShowcase.jsx
import React from 'react';
const brands = [
  { name: 'Intel', logoUrl: 'https://i.pinimg.com/736x/c2/54/df/c254df6837ecc0a6a5877d378801fdfe.jpg' },
  { name: 'AMD', logoUrl: 'https://i.redd.it/q0h7bdu1mv251.png' },
  { name: 'NVIDIA', logoUrl: 'https://wallpapers.com/images/hd/nvidia-4k-uhd-eo4dvqfrdjbka7hw.jpg' },
  { name: 'ASUS', logoUrl: 'https://dlcdnrog.asus.com/rog/media/1487179873321.webp' },
  { name: 'MSI', logoUrl: 'https://images8.alphacoders.com/130/1306182.jpeg' },
  { name: 'Corsair', logoUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/c912aa42-301c-4141-a624-745ab5702e03/dc8odxe-9b7b3fef-9a39-4006-8bfe-a30e4adcd90b.jpg' },
  { name: 'Rog Strix', logoUrl: 'https://4kwallpapers.com/images/wallpapers/asus-rog-colorful-3840x2160-9535.jpg' },
  { name: 'Geforce', logoUrl: 'https://wallpapers.com/images/hd/nvidia-gtx-neon-green-ijq9b4rr3xq7d6zx.jpg' },
  { name: 'G.Skill', logoUrl: 'https://wallpapercave.com/wp/wp7790709.jpg' },
  { name: 'Tuf Gaming', logoUrl: 'https://wallpapers.com/images/hd/asus-t-u-f-gaming-logoon-black-background-tlb275e9ut9spgcj.jpg' },
  // Thêm logo các hãng khác nếu muốn
];

function BrandShowcase() {
    const duplicatedBrands = [...brands, ...brands];
  return (
    <div className="brand-showcase-container">
      <h2 className="section-title">Thương Hiệu Hàng Đầu</h2>
      <div className="brand-logos">
        {brands.map(brand => (
          <div key={brand.name} className="brand-logo-item">
            <img src={brand.logoUrl} alt={`${brand.name} logo`} />
            <p className="brand-name">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrandShowcase;