// src/components/DealCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../../pages/Home.css'; // Đảm bảo đường dẫn CSS đúng
import { useCart } from '../../hooks/useCart';

const DealCard = ({ deal }) => {
  const { handlers } = useCart();
  // Tính toán phần trăm giảm giá
  const discountPercent = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const basePrice = Number(deal.originalPrice || deal.discountPrice || 0);
    const dealPercent = basePrice > 0
      ? Math.max(0, Math.round(((basePrice - Number(deal.discountPrice || 0)) / basePrice) * 1000) / 10)
      : 0;

    try {
      await handlers.handleAddDealToCart({
        id: `sample-${deal.id}`,
        productName: deal.name,
        salePrice: basePrice || Number(deal.discountPrice || 0),
        dealPercentage: dealPercent,
        quantity: Number(deal.remaining || 1),
        quantityUnit: 'item',
        mainImage: deal.imageUrl,
        allImages: [deal.imageUrl],
        ownerUid: `sample-store-${String(deal.storeName || 'store').replace(/\s+/g, '-').toLowerCase()}`,
        ownerDisplayName: deal.storeName || 'Cửa hàng mẫu',
      });
    } catch (error) {
      console.error('Cannot add sample deal to cart:', error);
      alert('Không thể thêm vào giỏ hàng, vui lòng thử lại.');
    }
  };

  return (
    <Link to={`/product/${deal.id}`} className="deal-card">
      <button className="deal-card__add-to-cart" onClick={handleAddToCart} type="button">
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