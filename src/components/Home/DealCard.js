// src/components/DealCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../../pages/Home.css'; // Đảm bảo đường dẫn CSS đúng

const DealCard = ({ deal }) => {
  // Tính toán phần trăm giảm giá
  const discountPercent = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);

  return (
    <Link to={`/product/${deal.id}`} className="deal-card">
      <button className="deal-card__add-to-cart" onClick={(e) => {
        e.preventDefault();
        console.log(`Thêm sản phẩm ${deal.id} vào giỏ hàng`);
      }}>
        <i className='bx bx-cart-add'></i>
      </button>

      <div className="deal-card__image">
        <img src={deal.imageUrl} alt={deal.name} />
        {discountPercent > 0 && (
          <span className="deal-card__discount-tag">-{discountPercent}%</span>
        )}
      </div>

      <div className="deal-card__content">
        <h3 className="deal-card__title">{deal.name}</h3>
        
        <div className="deal-card__info-bar">
          <span className="info-item"><i className='bx bx-time-five'></i> {deal.expiry}</span>
          <span className="info-item"><i className='bx bx-package'></i> Còn lại: {deal.remaining}</span>
        </div>

        <div className="deal-card__store-info">
          <span className="store-name">{deal.storeName}</span>
          <span className="store-distance">{deal.distance}</span>
        </div>

        <div className="deal-card__price">
          <span className="price--new">{deal.discountPrice.toLocaleString('vi-VN')}đ</span>
          <span className="price--old">{deal.originalPrice.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
    </Link>
  );
};

export default DealCard;