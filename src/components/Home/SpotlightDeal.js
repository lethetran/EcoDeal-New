// src/components/SpotlightDealsSlider.js (tên file mới đề xuất)

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Dùng Link cho các nút
// Import icon cho các nút < >
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './SpotlightDeal.css'; // Import CSS cho slider

// 1. TẠO DỮ LIỆU MẪU CHO SLIDER
// Mỗi object trong mảng này sẽ là một slide
const spotlightDealsData = [
  {
    id: 1,
    tag: 'Ưu Đãi Của Ngày',
    title: 'Pizza Chay Rau Củ Tươi',
    description: "Một sự kết hợp hoàn hảo từ rau củ tươi ngon trên lớp đế bánh giòn rụm. Đây không chỉ là một bữa ăn, mà là một trải nghiệm vị giác từ Pizza 4P's.",
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=2070',
    priceText: 'Nhận ngay chỉ với 89.000đ',
    link: '/deals/1'
  },
  {
    id: 2,
    tag: 'Bán Chạy Nhất',
    title: 'Combo Bún Chả Đặc Sắc',
    description: 'Thưởng thức hương vị bún chả Hà Nội trứ danh với thịt nướng đậm đà, nước chấm chua ngọt và rau sống tươi mát. Một lựa chọn không thể bỏ qua.',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=1887',
    priceText: 'Ưu đãi chỉ còn 35.000đ',
    link: '/deals/2'
  },
  {
    id: 3,
    tag: 'Món Mới Tuần Này',
    title: 'Tô Trái Cây Nhiệt Đới',
    description: 'Giải nhiệt mùa hè với tô trái cây đầy ắp dâu tây, kiwi, việt quất và sữa chua Hy Lạp. Tươi ngon, bổ dưỡng và cực kỳ sảng khoái.',
    image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1978',
    priceText: 'Dùng thử chỉ 50.000đ',
    link: '/deals/3'
  }
];

const SpotlightDealsSlider = () => {
    // 2. SỬ DỤNG STATE ĐỂ THEO DÕI SLIDE HIỆN TẠI
    const [currentIndex, setCurrentIndex] = useState(0);

    // 3. TẠO CÁC HÀM ĐỂ CHUYỂN SLIDE
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? spotlightDealsData.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === spotlightDealsData.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <section className="dashboard-section">
            {/* 4. TẠO CẤU TRÚC HTML CHO SLIDER */}
            <div className="spotlight-slider">
                {/* Các nút điều khiển */}
                <button onClick={goToPrevious} className="slider-button prev">
                    <FiChevronLeft />
                </button>
                <button onClick={goToNext} className="slider-button next">
                    <FiChevronRight />
                </button>

                {/* Wrapper để ẩn các slide khác */}
                <div className="slider-wrapper">
                    {/* Track chứa tất cả các slide, sẽ di chuyển bằng CSS transform */}
                    <div className="slider-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {spotlightDealsData.map((deal) => (
                            <div key={deal.id} className="slider-slide">
                                {/* Tái sử dụng layout .spotlight-deal của bạn */}
                                <div className="spotlight-deal">
                                    <div className="spotlight-image">
                                        <img src={deal.image} alt={deal.title} />
                                    </div>
                                    <div className="spotlight-info">
                                        <span className="tag">{deal.tag}</span>
                                        <h2>{deal.title}</h2>
                                        <p>{deal.description}</p>
                                        <Link to={deal.link} className="btn-primary">
                                            {deal.priceText}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpotlightDealsSlider;