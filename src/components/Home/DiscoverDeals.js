// src/components/DiscoverDeals.js
import React from 'react';
import '../../pages/Home.css'; 
import DealCard from './DealCard'; // 1. IMPORT COMPONENT TÁI SỬ DỤNG

// 2. TẠO DỮ LIỆU MẪU CHO PHẦN "KHÁM PHÁ THÊM"
const discoverDealsData = [
  // Tiệm Bánh
  {
    id: 1,
    name: 'Combo Bánh Ngọt Cuối Ngày',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400',
    expiry: 'Hết hạn trong ngày',
    remaining: 5,
    originalPrice: 150000,
    discountPrice: 75000,
    storeName: 'Paris Gateaux',
    distance: '1.2km'
  },
  {
    id: 2,
    name: 'Túi Bánh Mì Ngũ Cốc',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    expiry: 'Dùng trong 24h',
    remaining: 8,
    originalPrice: 70000,
    discountPrice: 35000,
    storeName: 'Artisan Bakery',
    distance: '800m'
  },
  {
    id: 3,
    name: 'Bánh Sừng Bò Bơ Tỏi',
    imageUrl: 'https://images.unsplash.com/photo-1622619330779-817151745a43?w=400',
    expiry: 'Hết hạn 18:00',
    remaining: 6,
    originalPrice: 45000,
    discountPrice: 22000,
    storeName: 'Le Petit Four',
    distance: '1.1km'
  },
  {
    id: 4,
    name: 'Ổ Bánh Mì Gối Sandwich',
    imageUrl: 'https://images.unsplash.com/photo-1586512342248-6a581ba5f22a?w=400',
    expiry: 'Còn 2 ngày',
    remaining: 14,
    originalPrice: 40000,
    discountPrice: 20000,
    storeName: 'Boulangerie Paul',
    distance: '2.5km'
  },

  // Siêu thị & Cửa hàng tiện lợi
  {
    id: 5,
    name: 'Lốc 4 Hộp Sữa Chua Hy Lạp',
    imageUrl: 'https://images.unsplash.com/photo-1562119420-a61632737404?w=400',
    expiry: 'Còn 2 ngày',
    remaining: 8,
    originalPrice: 95000,
    discountPrice: 45000,
    storeName: 'Siêu thị MegaMart',
    distance: '2.5km'
  },
  {
    id: 6,
    name: 'Khay Thịt Bò Úc Tươi',
    imageUrl: 'https://images.unsplash.com/photo-1603048209209-152f7f137e0f?w=400',
    expiry: 'Hết hạn hôm nay',
    remaining: 4,
    originalPrice: 250000,
    discountPrice: 125000,
    storeName: 'An Nam Gourmet',
    distance: '3.1km'
  },
  {
    id: 7,
    name: 'Vỉ 10 Trứng Gà Ta',
    imageUrl: 'https://images.unsplash.com/photo-1587486913049-52fc082a3236?w=400',
    expiry: 'Còn 3 ngày',
    remaining: 15,
    originalPrice: 40000,
    discountPrice: 20000,
    storeName: 'Circle K',
    distance: '450m'
  },
  {
    id: 8,
    name: 'Hộp Sandwich Gà Teriyaki',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    expiry: 'Dùng trong ngày',
    remaining: 6,
    originalPrice: 65000,
    discountPrice: 39000,
    storeName: 'FamilyMart',
    distance: '800m'
  },
  {
    id: 9,
    name: 'Chai Sữa Tươi Thanh Trùng',
    imageUrl: 'https://images.unsplash.com/photo-1620189507195-68309c04c4d0?w=400',
    expiry: 'Còn 1 ngày',
    remaining: 10,
    originalPrice: 38000,
    discountPrice: 19000,
    storeName: 'WinMart+',
    distance: '600m'
  },

  // Rau củ & Trái cây
  {
    id: 10,
    name: 'Hộp Rau Củ Hữu Cơ Sạch',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    expiry: 'Còn 2 ngày',
    remaining: 15,
    originalPrice: 120000,
    discountPrice: 60000,
    storeName: 'Vườn Rau Sạch',
    distance: '3.2km'
  },
  {
    id: 11,
    name: 'Combo Trái Cây Nhập Khẩu',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
    expiry: 'Còn 1 ngày',
    remaining: 9,
    originalPrice: 250000,
    discountPrice: 150000,
    storeName: 'Fruitopia',
    distance: '4.5km'
  },
  {
    id: 12,
    name: 'Túi Nấm Tươi Đà Lạt',
    imageUrl: 'https://images.unsplash.com/photo-1528504923239-2a910f13521e?w=400',
    expiry: 'Còn 3 ngày',
    remaining: 11,
    originalPrice: 85000,
    discountPrice: 40000,
    storeName: 'Nông Sản Đà Lạt',
    distance: '3.0km'
  },
  {
    id: 13,
    name: 'Set 3 Bó Xà Lách Xoong',
    imageUrl: 'https://images.unsplash.com/photo-1550501131-39f2a013a486?w=400',
    expiry: 'Dùng trong ngày',
    remaining: 18,
    originalPrice: 50000,
    discountPrice: 25000,
    storeName: 'Vườn Rau Sạch',
    distance: '3.2km'
  },
  {
    id: 14,
    name: 'Rổ Cà Chua Bi Cherry',
    imageUrl: 'https://images.unsplash.com/photo-1461351292913-9a3b6f0e4b83?w=400',
    expiry: 'Còn 3 ngày',
    remaining: 22,
    originalPrice: 65000,
    discountPrice: 30000,
    storeName: 'Nông Sản Đà Lạt',
    distance: '3.0km'
  },

  // Quán ăn & Nước uống
  {
    id: 15,
    name: 'Hộp Salad Gà Nướng',
    imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b160522d?w=400',
    expiry: 'Dùng trong ngày',
    remaining: 7,
    originalPrice: 90000,
    discountPrice: 45000,
    storeName: 'Healthy Corner',
    distance: '1.8km'
  },
  {
    id: 16,
    name: 'Phở Bò Đặc Biệt',
    imageUrl: 'https://images.unsplash.com/photo-1585559987413-58536fdefa49?w=400',
    expiry: 'Hết hạn 14:00',
    remaining: 4,
    originalPrice: 60000,
    discountPrice: 40000,
    storeName: 'Phở Lý Quốc Sư',
    distance: '2.1km'
  },
  {
    id: 17,
    name: 'Combo 2 chai nước ép',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
    expiry: 'Còn lại 3 giờ',
    remaining: 10,
    originalPrice: 80000,
    discountPrice: 48000,
    storeName: 'Juice Bar',
    distance: '500m'
  },
  {
    id: 18,
    name: 'Hộp Cơm Tấm Sườn Bì',
    imageUrl: 'https://images.unsplash.com/photo-1598514983318-76a8a1c91162?w=400',
    expiry: 'Hết hạn 13:00',
    remaining: 9,
    originalPrice: 55000,
    discountPrice: 35000,
    storeName: 'Cơm Tấm Cali',
    distance: '1.4km'
  },
  {
    id: 19,
    name: 'Chai Nước Ép Cần Tây Mix',
    imageUrl: 'https://images.unsplash.com/photo-1590292257218-9710a3103437?w=400',
    expiry: 'Dùng trong 24h',
    remaining: 9,
    originalPrice: 70000,
    discountPrice: 40000,
    storeName: 'Juice Up!',
    distance: '950m'
  },
  {
    id: 20,
    name: 'Phần Sushi Combo Giảm Giá',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
    expiry: 'Hết hạn 20:00',
    remaining: 3,
    originalPrice: 300000,
    discountPrice: 180000,
    storeName: 'Sushi Tei',
    distance: '3.5km'
  }
];

function DiscoverDeals() {
    return (
        // Sử dụng className "full-width" để dễ dàng target bằng CSS
        <section className="dashboard-section full-width">
            
            {/* === SỬA ĐỔI CHÍNH === */}
            {/* 1. Đưa tiêu đề ra ngoài, nhưng vẫn giữ cấu trúc chuẩn */}
            <div className="container">
                <div className="dashboard-section-header">
                    <h2>Khám phá thêm</h2>
                    <p>Những ưu đãi hấp dẫn khác đang chờ bạn phía trước.</p>
                </div>
            </div>

            {/* 2. Slider container bây giờ nằm ngoài thẻ .container */}
            <div className="deals__container deals__container--scrollable">
                {discoverDealsData.map(deal => (
                    <DealCard key={deal.id} deal={deal} />
                ))}
            </div>
        </section>
    );
}

export default DiscoverDeals;