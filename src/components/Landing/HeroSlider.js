// src/components/landing/HeroSlider.js
import React, { useState, useEffect } from 'react';
import styles from './HeroSlider.module.css';

// Tách dữ liệu ra để dễ quản lý và tái sử dụng
const slidesData = [
    {
        videoSrc: "/placeholders/deal-placeholder.svg",
        title: "Tươi Mới Mỗi Ngày",
        subtitle: "Đón nhận tinh túy từ đất mẹ với giá yêu thương."
    },
    {
        videoSrc: "/placeholders/deal-placeholder.svg",
        title: "Chia Sẻ Khoảnh Khắc",
        subtitle: "Biến mỗi bữa ăn thành một kỷ niệm đáng nhớ."
    },
    {
        videoSrc: "/placeholders/deal-placeholder.svg",
        title: "Nghệ Thuật Từ Tâm",
        subtitle: "Mỗi nguyên liệu đều xứng đáng trở thành một kiệt tác."
    }
];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = slidesData.length;
    const slideDuration = 8000; // 8 giây

    useEffect(() => {
        // Thiết lập một interval để tự động chuyển slide
        const timer = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % totalSlides);
        }, slideDuration);

        // Cleanup function: xóa interval khi component bị unmount
        return () => clearInterval(timer);
    }, [totalSlides]); // Chỉ chạy lại effect nếu số lượng slide thay đổi

    return (
        <div className={styles.videoStage}>
            <div
                className={styles.videoSlider}
                style={{
                    width: `${totalSlides * 100}%`,
                    transform: `translateX(-${currentIndex * (100 / totalSlides)}%)`
                }}
            >
                {slidesData.map((slide, index) => (
                    <div className={styles.videoSlide} key={index}>
                        <video src={slide.videoSrc} autoPlay muted loop playsInline></video>
                        {/* 
                          Sử dụng key={currentIndex} để buộc React render lại hoàn toàn
                          phần slide-content mỗi khi slide thay đổi. Điều này sẽ
                          kích hoạt lại animation "text-reveal" một cách tự nhiên.
                        */}
                        {index === currentIndex && (
                            <div className={styles.slideContent} key={currentIndex}>
                                <h1>{slide.title}</h1>
                                <p>{slide.subtitle}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.sliderControls}>
                <div className={styles.progressBarContainer}>
                    {/* 
                      Tương tự, sử dụng key={currentIndex} để reset progress bar.
                      Mỗi khi key thay đổi, React sẽ tạo lại phần tử này,
                      và animation sẽ chạy lại từ đầu.
                    */}
                    <div
                        className={`${styles.progressBar} ${styles.progressBarAnimating}`}
                        key={currentIndex}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlider;