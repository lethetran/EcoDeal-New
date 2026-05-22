// src/components/MarqueeDeals.js

import React from 'react';
import DealCard from './DealCard'; // Tái sử dụng DealCard
import '../../pages/Home.css';// Đảm bảo bạn có import CSS

// === DỮ LIỆU ĐÃ ĐƯỢC CHUẨN HÓA ===
// Tên thuộc tính giờ đây giống hệt với discoverDealsData
const marqueeDealsData = [
 // BỘ 20 DỮ LIỆU MỚI (ID 101-120) - NỐI TIẾP VÀO MẢNG CÓ SẴN
  {
    id: 104,
    name: 'Bó Xà Lách Romain Tươi',
    imageUrl: 'https://images.unsplash.com/photo-1662318183333-971ae1658e44?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    expiry: 'Còn 2 ngày',
    remaining: 11,
    originalPrice: 35000,
    discountPrice: 18000,
    storeName: 'Vườn Rau Sạch',
    distance: '3.2km'
  },

  {
    id: 106,
    name: 'Bánh Mì Vòng Simit Thổ Nhĩ Kỳ',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1730720756529-b42052346ec7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8QiVDMyVBMW5oJTIwTSVDMyVBQyUyMFYlQzMlQjJuZyUyMFNpbWl0JTIwVGglRTElQkIlOTUlMjBOaCVDNCVBOSUyMEslRTElQkIlQjN8ZW58MHx8MHx8fDA%3D',
    expiry: 'Dùng trong ngày',
    remaining: 10,
    originalPrice: 40000,
    discountPrice: 20000,
    storeName: 'Istanbul Delights',
    distance: '3.0km'
  },
  {
    id: 107,
    name: 'Củ Khoai Lang Mật (1kg)',
    imageUrl: 'https://images.unsplash.com/photo-1680472628312-9ff2605ee718?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEMlRTElQkIlQTclMjBLaG9haSUyMExhbmd8ZW58MHx8MHx8fDA%3D',
    expiry: 'Còn 5 ngày',
    remaining: 15,
    originalPrice: 45000,
    discountPrice: 22000,
    storeName: 'Nông Sản Đà Lạt',
    distance: '3.0km'
  },
  {
    id: 108,
    name: 'Măng Tây Hữu Cơ',
    imageUrl: 'https://images.pexels.com/photos/5791681/pexels-photo-5791681.jpeg',
    expiry: 'Hết hạn hôm nay',
    remaining: 12,
    originalPrice: 25000,
    discountPrice: 12000,
    storeName: 'Vườn An Lành',
    distance: '3.5km'
  },

  {
    id: 114,
    name: 'Cây Bông Cải Xanh VietGAP',
    imageUrl: 'https://product.hstatic.net/1000141988/product/b_ng_c_i_xanh_vietgap_dhf_200_g_6e56cc8f8ce34805908e4deb966d47d6_master.jpg',
    expiry: 'Còn 2 ngày',
    remaining: 10,
    originalPrice: 38000,
    discountPrice: 19000,
    storeName: 'Go! Supermarket',
    distance: '2.9km'
  },
  {
    id: 117,
    name: 'Bánh Financier Hạnh Nhân',
    imageUrl: 'https://i.pinimg.com/736x/a8/78/8e/a8788e0827215bcfe653f281eb386dce.jpg',
    expiry: 'Còn 4 ngày',
    remaining: 9,
    originalPrice: 85000,
    discountPrice: 45000,
    storeName: 'Le Petit Four',
    distance: '1.1km'
  },
  {
    id: 118,
    name: 'Củ Dền Tươi',
    imageUrl: 'https://images.unsplash.com/photo-1594400316020-f357da8a2848?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEMlRTElQkIlQTclMjBEJUUxJUJCJTgxbiUyMFQlQzYlQjAlQzYlQTFpfGVufDB8fDB8fHww',
    expiry: 'Còn 4 ngày',
    remaining: 8,
    originalPrice: 40000,
    discountPrice: 20000,
    storeName: 'Vườn An Lành',
    distance: '3.5km'
  },
  {
    id: 119,
    name: 'Bánh Biscotti Nguyên Cám',
    imageUrl: 'https://i.pinimg.com/736x/fa/b8/a4/fab8a4c5ccc3c200fb96e75ed060bc0e.jpg',
    expiry: 'Còn 1 tuần',
    remaining: 7,
    originalPrice: 120000,
    discountPrice: 70000,
    storeName: 'Healthy Corner',
    distance: '1.8km'
  },
  {
    id: 120,
    name: 'Khay Rau Muống Hữu Cơ',
    imageUrl: 'https://bizweb.dktcdn.net/100/021/951/products/rau-muong-huu-co-happy-vegi-55x50.jpg?v=1628994433760',
    expiry: 'Hết hạn hôm nay',
    remaining: 13,
    originalPrice: 28000,
    discountPrice: 14000,
    storeName: 'Farmers\' Market',
    distance: '2.8km'
  }
];

const MarqueeDeals = () => {
    // Nhân đôi mảng để tạo hiệu ứng lặp vô hạn
    const duplicatedDeals = [...marqueeDealsData, ...marqueeDealsData];

    return (
        <section className="dashboard-section marquee-section">
             <div className="dashboard-section-header">
                <h2>Ưu Đãi Chớp Nhoáng</h2>
                <p>Những "túi bất ngờ" này đang được săn đón nhiều nhất! Đừng bỏ lỡ.</p>
            </div>
            <div className="marquee-wrapper">
                <div className="marquee-slider">
                    {duplicatedDeals.map((deal, index) => (
                        // Sử dụng key duy nhất để tránh lỗi render
                        <DealCard key={`marquee-${deal.id}-${index}`} deal={deal} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MarqueeDeals;