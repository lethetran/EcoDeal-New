import React, { useState, useEffect } from 'react';
import './FlashDealNotification.css';

const FlashDealNotification = () => {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const isFruitDeal = (deal) => deal?.category === 'fresh_fruits' || deal?.quantityUnit === 'kg';

  const formatQuantity = (deal) => {
    const quantity = Number(deal?.quantity) || 0;
    if (isFruitDeal(deal)) {
      return `${quantity.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kg`;
    }
    return `${Math.round(quantity)} sản phẩm`;
  };

  const formatPrice = (deal) => {
    const price = Math.round(Number(deal?.salePrice) || 0).toLocaleString('vi-VN');
    return isFruitDeal(deal) ? `${price}đ/1kg` : `${price}đ`;
  };

  useEffect(() => {
    // Listen cho event "newFlashDeal" từ PostProduct
    const handleNewFlashDeal = (event) => {
      const product = event.detail;
      setNotification({
        productName: product.productName,
        quantity: product.quantity,
        quantityUnit: product.quantityUnit,
        dealPercentage: product.dealPercentage,
        salePrice: product.salePrice,
        category: product.category,
      });
      setIsVisible(true);

      // Tự động ẩn sau 5 giây
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('newFlashDeal', handleNewFlashDeal);
    return () => window.removeEventListener('newFlashDeal', handleNewFlashDeal);
  }, []);

  if (!isVisible || !notification) return null;

  return (
    <div className="flash-deal-notification">
      <div className="flash-deal-content">
        <span className="flash-icon">⚡</span>
        <div className="flash-deal-info">
          <p className="flash-title">Ưu Đãi Nổi Bật Mới!</p>
          <p className="flash-product">{notification.productName}</p>
          <p className="flash-details">
            SL: <span className="discount">{formatQuantity(notification)}</span> | 
            Giảm: <span className="discount">{notification.dealPercentage}%</span> | 
            Giá: <span className="price">{formatPrice(notification)}</span>
          </p>
        </div>
        <button 
          className="flash-close-btn"
          onClick={() => setIsVisible(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default FlashDealNotification;
