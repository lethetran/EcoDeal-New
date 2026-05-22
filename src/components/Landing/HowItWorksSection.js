import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import styles from './HowItWorksSection.module.css';

const stepsData = [
    { number: 1, title: 'Khám Phá', description: 'Tìm kiếm các ưu đãi hấp dẫn từ những cửa hàng gần bạn.' },
    { number: 2, title: 'Đặt Hàng', description: 'Chọn "Túi Bất Ngờ" hoặc sản phẩm yêu thích và thanh toán.' },
    { number: 3, title: 'Nhận & Thưởng Thức', description: 'Đến nhận hàng vào khung giờ quy định và tận hưởng bữa ăn ngon.' },
];

const HowItWorksSection = () => {
    return (
        <section className={styles.howItWorksSection}>
            <AnimateOnScroll>
                <h2>Hành Trình 3 Bước Đơn Giản</h2>
            </AnimateOnScroll>
            <div className={styles.stepsContainer}>
                {stepsData.map((step, index) => (
                    <AnimateOnScroll key={index}>
                        <div className={styles.step}>
                            <span>{step.number}</span>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    </AnimateOnScroll>
                ))}
            </div>
        </section>
    );
};

export default HowItWorksSection;