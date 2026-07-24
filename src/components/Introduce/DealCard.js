// src/components/Introduce/DealCard.js (Phiên bản nâng cấp)

import React from 'react';
import { Link } from 'react-router-dom';
import '../../pages/Introduce.css'; // Đảm bảo đường dẫn CSS đúng
import { useCart } from '../../hooks/useCart';

const DealCard = ({ id, image, tag, title, store, oldPrice, newPrice, info }) => {
  const { handlers } = useCart();

  // ---- PHẦN XỬ LÝ DỮ LIỆU ----
  // Tự động tách chuỗi "Cửa hàng • Khoảng cách"
  const [storeName, distance] = store.split('•').map(item => item.trim());

  // Xác định xem "info" là HSD hay là số lượng còn lại
  const isExpiryInfo = info.toLowerCase().includes('nhận hàng') || info.toLowerCase().includes('hết hạn');

  const parseVnd = (value) => Number(String(value || '').replace(/[^\d]/g, '')) || 0;

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const originalPrice = parseVnd(oldPrice);
    const discountPrice = parseVnd(newPrice);
    const dealPercent = originalPrice > 0
      ? Math.max(0, Math.round(((originalPrice - discountPrice) / originalPrice) * 1000) / 10)
      : 0;

    try {
      await handlers.handleAddDealToCart({
        id: `sample-${id}`,
        productName: title,
        salePrice: originalPrice || discountPrice,
        dealPercentage: dealPercent,
        quantity: 1,
        quantityUnit: 'item',
        mainImage: image,
        allImages: [image],
        ownerUid: `sample-store-${storeName.replace(/\s+/g, '-').toLowerCase()}`,
        ownerDisplayName: storeName,
      });
    } catch (error) {
      console.error('Cannot add introduce card to cart:', error);
      alert('Không thể thêm vào giỏ hàng, vui lòng thử lại.');
    }
  };

  return (
    // Bọc toàn bộ thẻ bằng Link (cần id từ component cha)
    <Link to={`/product/${id}`} className="deal-card">
      
      <button className="deal-card__add-to-cart" onClick={handleAddToCart} type="button">
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