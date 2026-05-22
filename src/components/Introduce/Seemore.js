import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedDeals = () => {
  // 1. Định nghĩa số lượng sản phẩm hiển thị ban đầu và số lượng tải thêm
  const INITIAL_VISIBLE_DEALS = 8;
  const DEALS_TO_LOAD_MORE = 4;

  // 2. Sử dụng useState để quản lý số lượng sản phẩm đang hiển thị
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_DEALS);

  // 3. Hàm xử lý khi nhấn nút "Xem thêm"
  const handleSeeMore = () => {
    setVisibleCount(prevCount => prevCount + DEALS_TO_LOAD_MORE);
  };

  return (
    <section className="deals-section pt-0">
      <div className="container">
        {/* Dùng .slice() để chỉ lấy số lượng sản phẩm cần hiển thị từ mảng dữ liệu */}
        <div className="deals-grid__container">
          {dealsData.slice(0, visibleCount).map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* 4. Nút "Xem thêm" chỉ hiển thị khi số lượng sản phẩm đang hiển thị nhỏ hơn tổng số sản phẩm */}
        {visibleCount < dealsData.length && (
          <div className="see-more-container">
            <button onClick={handleSeeMore} className="see-more-btn">
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}