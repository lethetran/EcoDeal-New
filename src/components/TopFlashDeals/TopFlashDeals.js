import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TopFlashDeals.css';
import { fetchLatestDeals } from '../../services/dealService';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import VerifiedBadge from '../VerifiedBadge/VerifiedBadge';
import ProductQuickView from '../ProductQuickView/ProductQuickView';
import Toast from '../Toast/Toast';

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

const shouldBlink = (deal) => {
  const { hours, msLeft } = getDetailedTimeRemaining(deal);
  return (hours < 3 || (hours === 0 && msLeft > 0));
};

const calculateDealPercentage = (deal) => {
  if (!deal.timestamp) return deal.dealPercentage || 0;
  const expiryDate = getExpiryDate(deal);
  if (!expiryDate) return deal.dealPercentage || 0;

  const now = new Date();

  if (now >= expiryDate) return 0;

  const timestampDate = new Date(deal.timestamp);
  const msElapsed = now - timestampDate;

  let timeElapsed = 0;
  if (deal.reductionUnit === 'hour') {
    timeElapsed = Math.ceil(msElapsed / (1000 * 60 * 60));
  } else {
    timeElapsed = Math.ceil(msElapsed / (1000 * 60 * 60 * 24));
  }

  const initial = parseFloat(deal.initialDiscount) || 0;
  const daily = parseFloat(deal.dailyReduction) || 0;
  const maxThreshold = parseFloat(deal.maxDiscountThreshold) || 0;

  let dealPercent = initial + (daily * timeElapsed);

  console.log(`[Calculate] ${deal.productName}:`, {
    timeElapsed,
    unit: deal.reductionUnit,
    initial,
    daily,
    calculated: dealPercent,
    beforeMaxCap: dealPercent,
  });

  if (maxThreshold > 0 && dealPercent > maxThreshold) {
    dealPercent = maxThreshold;
  }

  dealPercent = Math.min(100, Math.max(0, dealPercent));

  return Math.round(dealPercent * 10) / 10;
};

const calculateDaysRemaining = (deal) => {
  const expiryDate = getExpiryDate(deal);
  if (!expiryDate) return 0;

  const today = new Date();
  const msLeft = expiryDate - today;

  if (msLeft <= 0) return 0;

  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

  return Math.max(0, daysLeft);
};

const dedupeDeals = (dealList = []) => {
  const map = new Map();
  dealList.forEach((deal) => {
    const key = String(deal.id || `${deal.productName}-${deal.timestamp || ''}`);
    if (!map.has(key)) {
      map.set(key, deal);
    }
  });
  return [...map.values()].sort((a, b) => {
    const aTime = new Date(a.timestamp || a.createdAt || 0).getTime();
    const bTime = new Date(b.timestamp || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
};

const TopFlashDeals = () => {
  const navigate = useNavigate();
  const { currentUser, handlers } = useCart();
  const [deals, setDeals] = useState([]);
  const [cloudDeals, setCloudDeals] = useState([]);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [quickViewDeal, setQuickViewDeal] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const dealsGridRef = useRef(null);

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

  // Lấy deals từ Firestore và tính lại percentage
  const loadDealsWithUpdatedPercentage = useCallback(() => {
    const activeDeals = dedupeDeals(cloudDeals).filter((deal) => !isExpired(deal));

    // Đồng bộ cache local theo dữ liệu Firestore để tránh giữ deal đã bị xóa trên cloud.
    localStorage.setItem('flashDeals', JSON.stringify(activeDeals));

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
  }, [cloudDeals]);

  useEffect(() => {
    let isMounted = true;
    fetchLatestDeals(50)
      .then((dealsFromDb) => {
        if (!isMounted) return;
        setCloudDeals(dealsFromDb);
      })
      .catch((error) => {
        console.error('Cannot load deals from database:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    loadDealsWithUpdatedPercentage();
    
    // Cập nhật deals mỗi 1 giây để countdown realtime và smooth
    const interval = setInterval(() => {
      loadDealsWithUpdatedPercentage();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [loadDealsWithUpdatedPercentage]);

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
    const handleNewFlashDeal = (event) => {
      const createdDeal = event?.detail;
      if (createdDeal && createdDeal.id) {
        setCloudDeals((prev) => dedupeDeals([createdDeal, ...prev]));
        return;
      }

      fetchLatestDeals(50)
        .then((dealsFromDb) => {
          setCloudDeals(dealsFromDb);
        })
        .catch((error) => {
          console.error('Cannot reload deals after posting:', error);
        });
    };

    window.addEventListener('newFlashDeal', handleNewFlashDeal);
    return () => window.removeEventListener('newFlashDeal', handleNewFlashDeal);
  }, [loadDealsWithUpdatedPercentage]);

  const handleAddToCart = async (deal, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert('Bạn cần đăng nhập để lưu giỏ hàng theo tài khoản.');
      navigate('/login');
      return;
    }

    try {
      await handlers.handleAddDealToCart(deal);
      setToast({ show: true, message: '✅ Đã thêm vào giỏ hàng' });
    } catch (error) {
      console.error('Add to cart failed:', error);
      setToast({ show: true, message: '❌ Không thể thêm vào giỏ hàng, thử lại nhé' });
    }
  };

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
          {deals.length > 0 ? deals.map((deal, index) => (
            <div
              key={deal.id || index}
              className="flash-deal-card highlight"
              role="button"
              tabIndex={0}
              onClick={() => setQuickViewDeal(deal)}
              onKeyDown={(e) => { if (e.key === 'Enter') setQuickViewDeal(deal); }}
            >
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
                </h3>
                {deal.ecoCheckApproved && (
                  <div className="deal-verified-row">
                    <VerifiedBadge label="Đã kiểm duyệt" size="sm" />
                  </div>
                )}

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

                <button className="btn-add-cart" onClick={(e) => handleAddToCart(deal, e)}>
                  🛒 Thêm vào giỏ
                </button>
              </div>
            </div>
          )) : (
            <div className="deals-empty-state">
              Chưa có bài ưu đãi mới. Bạn có thể đăng bài để hiển thị ngay tại đây.
            </div>
          )}

          </div>

          {hasOverflow && (
            <button className="deals-nav deals-nav-right" onClick={() => scrollDeals('right')} aria-label="Xem ưu đãi tiếp theo">
              ›
            </button>
          )}
        </div>
      </div>

      {quickViewDeal && (
        <ProductQuickView deal={quickViewDeal} onClose={() => setQuickViewDeal(null)} />
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        onDone={() => setToast({ show: false, message: '' })}
      />
    </section>
  );
};

export default TopFlashDeals;
