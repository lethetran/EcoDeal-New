import React, { useEffect, useState } from 'react';
import './DiscoverDeals.css';
import { fetchLatestDeals } from '../../services/dealService';
import VerifiedBadge from '../VerifiedBadge/VerifiedBadge';
import ProductQuickView from '../ProductQuickView/ProductQuickView';

const FALLBACK_IMAGE = '/placeholders/deal-placeholder.svg';
const MAX_DEALS = 10;

const computeFinalPrice = (deal) => {
  const discount = Math.max(0, Math.min(100, Number(deal?.dealPercentage || 0)));
  const originalPrice = Math.max(0, Number(deal?.salePrice || 0));
  return Math.round(originalPrice * (1 - discount / 100));
};

function DiscoverDeals() {
  const [deals, setDeals] = useState([]);
  const [quickViewDeal, setQuickViewDeal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchLatestDeals(MAX_DEALS)
      .then((list) => {
        if (!cancelled) setDeals(list);
      })
      .catch((error) => console.error('Cannot load discover deals:', error));

    return () => {
      cancelled = true;
    };
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="discover-section">
      <div className="container">
        <div className="discover-header">
          <h2>Khám phá thêm</h2>
          <p>Những ưu đãi khác đang chờ bạn.</p>
        </div>

        <div className="discover-grid">
          {deals.map((deal) => {
            const finalPrice = computeFinalPrice(deal);
            const storeName = deal.ownerDisplayName || deal.ownerEmail || 'Cộng đồng Ecodeal';

            return (
              <div
                key={deal.id}
                className="discover-card"
                role="button"
                tabIndex={0}
                onClick={() => setQuickViewDeal(deal)}
                onKeyDown={(e) => { if (e.key === 'Enter') setQuickViewDeal(deal); }}
              >
                <div className="discover-card__image">
                  <img src={deal.mainImage || deal.allImages?.[0] || FALLBACK_IMAGE} alt={deal.productName} />
                  {deal.dealPercentage > 0 && (
                    <span className="discover-card__discount">-{Math.round(deal.dealPercentage)}%</span>
                  )}
                </div>

                <div className="discover-card__body">
                  <h3 className="discover-card__title">{deal.productName}</h3>

                  {deal.ecoCheckApproved && (
                    <div className="discover-card__badge-row">
                      <VerifiedBadge label="Đã kiểm duyệt" size="sm" />
                    </div>
                  )}

                  <div className="discover-card__price">
                    <span className="discover-card__price-new">{finalPrice.toLocaleString('vi-VN')}đ</span>
                    {deal.dealPercentage > 0 && (
                      <span className="discover-card__price-old">{Number(deal.salePrice || 0).toLocaleString('vi-VN')}đ</span>
                    )}
                  </div>

                  <span className="discover-card__store">
                    <i className="bx bxs-store-alt"></i> {storeName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {quickViewDeal && (
        <ProductQuickView deal={quickViewDeal} onClose={() => setQuickViewDeal(null)} />
      )}
    </section>
  );
}

export default DiscoverDeals;
