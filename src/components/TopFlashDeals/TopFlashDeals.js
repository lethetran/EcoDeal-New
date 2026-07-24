import React, { useState, useEffect, useRef } from 'react';
import './TopFlashDeals.css';

const TopFlashDeals = () => {
  const [deals, setDeals] = useState([]);
  const [hasOverflow, setHasOverflow] = useState(false);
  const dealsGridRef = useRef(null);

  const isFruitDeal = (deal) => deal?.category === 'fresh_fruits' || deal?.quantityUnit === 'kg';

  const formatQuantity = (deal) => {
    const quantity = Number(deal?.quantity) || 0;
    if (isFruitDeal(deal)) {
      return `${quantity.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kg`;
    }
    return `${Math.round(quantity)} sản phẩm`;
  };

  const formatPrice = (value, deal) => {
    const price = Math.round(Number(value) || 0).toLocaleString('vi-VN');
    return isFruitDeal(deal) ? `${price}đ/1kg` : `${price}đ`;
  };

  const getExpiryDate = (deal) => {
    if (deal?.expiryAt) {
      const parsedExpiryAt = new Date(deal.expiryAt);
      if (!Number.isNaN(parsedExpiryAt.getTime())) {
        return parsedExpiryAt;
      }
    }

    if (!deal?.hsd) return null;

    const hsdDate = new Date(deal.hsd);
    if (Number.isNaN(hsdDate.getTime())) {
      return null;
    }

    hsdDate.setHours(23, 59, 59, 999);
    return hsdDate;
  };

  const isExpired = (deal) => {
    const expiryDate = getExpiryDate(deal);
    if (!expiryDate) return false;
    return Date.now() >= expiryDate.getTime();
  };

  const scrollDeals = (direction) => {
    if (!dealsGridRef.current) return;
    const scrollAmount = 320;
    dealsGridRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const updateOverflowState = () => {
    if (!dealsGridRef.current) {
      setHasOverflow(false);
      return;
    }

    const { scrollWidth, clientWidth } = dealsGridRef.current;
    setHasOverflow(scrollWidth > clientWidth + 8);
  };

  // Function tính thời gian còn lại chi tiết (ngày, giờ, phút)
  const getDetailedTimeRemaining = (deal) => {
    const expiryDate = getExpiryDate(deal);
    if (!expiryDate) return { days: 0, hours: 0, minutes: 0, display: '0 ngày' };
    
    const now = new Date();
    const msLeft = expiryDate - now;
    
    if (msLeft <= 0) return { days: 0, hours: 0, minutes: 0, display: 'Hết hạn' };
    
    const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    let display = '';
    if (days > 0) {
      display = `Còn ${days} ngày`;
    } else if (hours > 0) {
      display = `Còn ${hours}h ${minutes}phút`;
    } else {
      display = `Còn ${Math.max(1, minutes)} phút`;
    }
    
    return { days, hours, minutes, display, msLeft };
  };

  // Function kiểm tra xem có cần blink hay không (< 3 giờ)
  const shouldBlink = (deal) => {
    const { hours, minutes, msLeft } = getDetailedTimeRemaining(deal);
    return (hours < 3 || (hours === 0 && msLeft > 0));
  };

  // Function tính deal percentage động dựa trên thời gian hiện tại
  const calculateDealPercentage = (deal) => {
    if (!deal.timestamp) return deal.dealPercentage || 0;
    const expiryDate = getExpiryDate(deal);
    if (!expiryDate) return deal.dealPercentage || 0;

    const now = new Date();
    
    // Kiểm tra xem hết hạn chưa
    if (now >= expiryDate) return 0;
    
    const timestampDate = new Date(deal.timestamp);
    const msElapsed = now - timestampDate;
    
    let timeElapsed = 0;
    if (deal.reductionUnit === 'hour') {
      timeElapsed = Math.ceil(msElapsed / (1000 * 60 * 60)); // Tính theo giờ
    } else {
      timeElapsed = Math.ceil(msElapsed / (1000 * 60 * 60 * 24)); // Tính theo ngày
    }

    // Công thức: dealPercent = initialDiscount + (dailyReduction * timeElapsed)
    // Ví dụ: 20% + (1% × 5 giờ) = 25%
    const initial = parseFloat(deal.initialDiscount) || 0;
    const daily = parseFloat(deal.dailyReduction) || 0;
    const maxThreshold = parseFloat(deal.maxDiscountThreshold) || 0;

    // Tính toán
    let dealPercent = initial + (daily * timeElapsed);
    
    console.log(`[Calculate] ${deal.productName}:`, {
      timeElapsed,
      unit: deal.reductionUnit,
      initial,
      daily,
      calculated: dealPercent,
      beforeMaxCap: dealPercent,
    });
    
    // Cap tại mức tối đa nếu có
    if (maxThreshold > 0 && dealPercent > maxThreshold) {
      dealPercent = maxThreshold;
    }
    
    // Giới hạn trong 0-100% (cap tại 100%)
    dealPercent = Math.min(100, Math.max(0, dealPercent));
    
    return Math.round(dealPercent * 10) / 10;
  };

  // Function tính ngày còn lại đến HSD
  const calculateDaysRemaining = (deal) => {
    const expiryDate = getExpiryDate(deal);
    if (!expiryDate) return 0;
    
    const today = new Date();
    const msLeft = expiryDate - today;
    
    if (msLeft <= 0) return 0;
    
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysLeft);
  };

  // Lấy deals từ localStorage và tính lại percentage
  const loadDealsWithUpdatedPercentage = () => {
    const flashDeals = JSON.parse(localStorage.getItem('flashDeals') || '[]');
    const activeDeals = flashDeals.filter((deal) => !isExpired(deal));

    if (activeDeals.length !== flashDeals.length) {
      localStorage.setItem('flashDeals', JSON.stringify(activeDeals));
    }

    const dealsWithUpdatedPercentage = activeDeals.slice(0, 5).map(deal => {
      const newPercentage = calculateDealPercentage(deal);
      const newDaysRemaining = calculateDaysRemaining(deal);
      const finalPrice = Math.round(parseFloat(deal.salePrice) * (1 - newPercentage / 100));
      
      // Log chi tiết để debug
      console.log(`✓ FINAL DEAL: ${deal.productName}`, {
        salePrice: deal.salePrice,
        initialDiscount: deal.initialDiscount,
        dailyReduction: deal.dailyReduction,
        reductionUnit: deal.reductionUnit,
        timestamp: deal.timestamp,
        hsd: deal.hsd,
        daysRemaining: newDaysRemaining,
        finalDiscount: `${newPercentage}% (with maxThreshold: ${deal.maxDiscountThreshold || 'none'})`,
        finalPrice: `${finalPrice}đ (from ${deal.salePrice}đ)`,
      });
      
      return {
        ...deal,
        dealPercentage: newPercentage,
        daysRemaining: newDaysRemaining,
      };
    });
    setDeals(dealsWithUpdatedPercentage);
  };

  useEffect(() => {
    loadDealsWithUpdatedPercentage();
    
    // Cập nhật deals mỗi 1 giây để countdown realtime và smooth
    const interval = setInterval(() => {
      loadDealsWithUpdatedPercentage();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateOverflowState();
  }, [deals]);

  useEffect(() => {
    const handleResize = () => updateOverflowState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen cho event newFlashDeal để cập nhật danh sách
  useEffect(() => {
    const handleNewFlashDeal = () => {
      loadDealsWithUpdatedPercentage();
    };

    window.addEventListener('newFlashDeal', handleNewFlashDeal);
    return () => window.removeEventListener('newFlashDeal', handleNewFlashDeal);
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="top-flash-deals">
      <div className="container">
        <h2 className="section-title">
          ⚡ <span className="highlight-text">ƯU ĐÃI TIẾT KIỆM</span> ⚡
        </h2>
        <p className="section-subtitle">Giảm giá sâu, số lượng có hạn - Mua ngay!</p>

        <div className="deals-carousel">
          {hasOverflow && (
            <button className="deals-nav deals-nav-left" onClick={() => scrollDeals('left')} aria-label="Xem ưu đãi trước">
              ‹
            </button>
          )}

          <div
            ref={dealsGridRef}
            className={`deals-grid ${hasOverflow ? 'has-overflow' : 'is-centered'}`}
          >
          {deals.map((deal, index) => (
            <div key={deal.id || index} className="flash-deal-card highlight">
              {/* Main Image */}
              <div className="deal-image-wrapper">
                <img 
                  src={deal.mainImage || deal.allImages?.[0]} 
                  alt={deal.productName}
                  className="deal-image"
                />
                <div className="deal-badge">
                  <span className="discount-percent">{Math.round(deal.dealPercentage * 10) / 10}%</span>
                </div>
                <div className="stock-badge">
                  SL: <strong>{formatQuantity(deal)}</strong>
                </div>
              </div>

              {/* Content */}
              <div className="deal-content">
                <h3 className="deal-name">
                  {deal.productName}
                  {deal.ecoCheckApproved && <span className="eco-checkmark"> ✅</span>}
                </h3>
                
                <div className="deal-price">
                  <span className="price-current">
                    {formatPrice(Math.round(parseFloat(deal.salePrice) * (1 - parseFloat(deal.dealPercentage) / 100)), deal)}
                  </span>
                  <span className="price-original">
                    {formatPrice(Math.round(parseFloat(deal.salePrice)), deal)}
                  </span>
                </div>

                <div className={`deal-info deal-info-${
                  deal.daysRemaining <= 1 ? 'urgent' :
                  deal.daysRemaining <= 3 ? 'warning' :
                  deal.daysRemaining <= 7 ? 'medium' :
                  'normal'
                }`}>
                  <span className="category-tag">{deal.category}</span>
                  <span className={`time-left ${shouldBlink(deal) ? 'blink' : ''}`}>
                    {getDetailedTimeRemaining(deal).display}
                  </span>
                </div>

                <div className="stock-progress-container">
                  <div className="stock-progress-bar">
                    <div 
                      className="stock-progress-fill" 
                      style={{
                        width: `${Math.min(100, Math.max(0, (deal.quantity || 0) % 101))}%`
                      }}
                    ></div>
                  </div>
                  <span className="stock-label">Còn {formatQuantity(deal)}</span>
                </div>

                <button className="btn-add-cart">
                  🛒 Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}

          </div>

          {hasOverflow && (
            <button className="deals-nav deals-nav-right" onClick={() => scrollDeals('right')} aria-label="Xem ưu đãi tiếp theo">
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopFlashDeals;
