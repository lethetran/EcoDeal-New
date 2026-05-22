// src/components/Introduce/DealCard.js (Phiên bản nâng cấp)

import React from 'react';
import { Link } from 'react-router-dom';
import '../../pages/Introduce.css'; // Đảm bảo đường dẫn CSS đúng

const DealCard = ({ id, image, tag, title, store, oldPrice, newPrice, info }) => {

  // ---- PHẦN XỬ LÝ DỮ LIỆU ----
  // Tự động tách chuỗi "Cửa hàng • Khoảng cách"
  const [storeName, distance] = store.split('•').map(item => item.trim());

  // Xác định xem "info" là HSD hay là số lượng còn lại
  const isExpiryInfo = info.toLowerCase().includes('nhận hàng') || info.toLowerCase().includes('hết hạn');

  return (
    // Bọc toàn bộ thẻ bằng Link (cần id từ component cha)
    <Link to={`/product/${id}`} className="deal-card">
      
      <button className="deal-card__add-to-cart" onClick={(e) => {
        e.preventDefault();
        console.log(`Thêm sản phẩm ${id} vào giỏ hàng`);
      }}>
        <i className='bx bx-cart-add'></i>
      </button>

      {/* ---- PHẦN RENDER RA CẤU TRÚC HTML PHỨC TẠP ---- */}
      <div className="deal-card__image">
        <img src={image} alt={title} />
        {/* Dùng prop "tag" để hiển thị tag giảm giá */}
        {tag && <span className="deal-card__discount-tag">{tag}</span>}
      </div>

      <div className="deal-card__content">
        <h3 className="deal-card__title">{title}</h3>
        
        {/* Thanh thông tin (HSD, còn lại) */}
        <div className="deal-card__info-bar">
          <span className="info-item">
            <i className='bx bx-time-five'></i> 
            {isExpiryInfo ? info : '---'} {/* Hiển thị HSD nếu có */}
          </span>
          <span className="info-item">
            <i className='bx bx-package'></i> 
            {!isExpiryInfo ? info : '---'} {/* Hiển thị số lượng còn lại nếu có */}
          </span>
        </div>

        {/* Thông tin cửa hàng và khoảng cách đã được tách */}
        <div className="deal-card__store-info">
          <span className="store-name">{storeName}</span>
          <span className="store-distance">{distance}</span>
        </div>

        {/* Giá cũ và giá mới */}
        <div className="deal-card__price">
          <span className="price--new">{newPrice}</span>
          <span className="price--old">{oldPrice}</span>
        </div>
      </div>
    </Link>
  );
};

export default DealCard;