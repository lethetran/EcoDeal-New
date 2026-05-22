// src/components/StoresSection.js
import React from 'react';
import '../../pages/Home.css'; 

function StoresSection() {
  return (
    <section className="dashboard-section">
      <div className="container">
        {/* === SỬA ĐỔI CHÍNH Ở ĐÂY === */}
        {/* 1. Bọc tiêu đề trong div.dashboard-section-header */}
        <div className="dashboard-section-header">
          {/* 2. Xóa className cũ và để thẻ <h2> trơn */}
          <h2>Gợi ý dành riêng cho bạn</h2>
          {/* (Tùy chọn) Bạn có thể thêm một dòng mô tả nhỏ ở đây nếu muốn */}
          <p>Các cửa hàng được yêu thích và có ưu đãi tốt gần bạn.</p>
        </div>
        <div className="stores__container">
          <div className="store-card">
            <div className="store-card__logo">
              <img src="https://i.imgur.com/7gMcb0w.png" alt="KFC Logo" />
            </div>
            <h3 className="store-card__name">KFC</h3>
            <span className="store-card__indicator">Có ưu đãi mới</span>
          </div>
          <div className="store-card">
            <div className="store-card__logo">
              <img src="https://i.imgur.com/agA5T9o.png" alt="Highlands Logo" />
            </div>
            <h3 className="store-card__name">Highlands Coffee</h3>
          </div>
          <div className="store-card">
            <div className="store-card__logo">
              <img src="https://i.imgur.com/uSH5x28.png" alt="Jollibee Logo" />
            </div>
            <h3 className="store-card__name">Jollibee</h3>
            <span className="store-card__indicator">Có ưu đãi mới</span>
          </div>
          <div className="store-card">
            <div className="store-card__logo">
              <img src="https://i.imgur.com/1YPA8p0.png" alt="Gong Cha Logo" />
            </div>
            <h3 className="store-card__name">Gong Cha</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoresSection;