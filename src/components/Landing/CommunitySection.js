// src/components/landing/CommunitySection.js
import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import styles from './CommunitySection.module.css';

const testimonialsData = [
    { quote: "Thật tuyệt vời khi vừa tiết kiệm được tiền, vừa góp phần bảo vệ môi trường. Các sản phẩm luôn tươi ngon bất ngờ!", author: "- Chị An, Đống Đa -" },
    { quote: "Ứng dụng rất dễ dùng. Mình đã khám phá ra nhiều tiệm bánh ngon gần nhà mà trước giờ không hề biết. Cảm ơn ECODEAL!", author: "- Anh Quang, Ba Đình -" },
    { quote: "Một ý tưởng nhân văn. Các 'Túi Bất Ngờ' luôn có giá trị cao hơn nhiều so với số tiền mình bỏ ra. Rất đáng thử.", author: "- Bạn Nguyên, Hoàn Kiếm -" }
];

const logosData = [
    { src: "/placeholders/deal-placeholder.svg", alt: "Partner Logo 1" },
    { src: "/placeholders/deal-placeholder.svg", alt: "Partner Logo 2" },
    { src: "/placeholders/deal-placeholder.svg", alt: "Partner Logo 3" },
    { src: "/placeholders/deal-placeholder.svg", alt: "Partner Logo 4" },
    { src: "/placeholders/deal-placeholder.svg", alt: "Partner Logo 5" }
];

const CommunitySection = () => {
    return (
        <section className={styles.communitySection}>
            <AnimateOnScroll>
                <h2>Tiếng Nói Từ Cộng Đồng</h2>
            </AnimateOnScroll>
            
            <AnimateOnScroll>
                <div className={styles.testimonialSliderWrapper}>
                    <div className={styles.testimonialSlider}>
                        {/* Render nhóm 1 (gốc) và nhóm 2 (bản sao) để tạo hiệu ứng lặp vô tận */}
                        {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                            <div className={styles.testimonialCard} key={index}>
                                <blockquote>{testimonial.quote}</blockquote>
                                <cite>{testimonial.author}</cite>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
                <div className={styles.partnerLogosSection}>
                    <h4>Các đối tác tiêu biểu đồng hành cùng chúng tôi</h4>
                    <div className={styles.logosContainer}>
                        {logosData.map((logo, index) => (
                            <img key={index} src={logo.src} alt={logo.alt} />
                        ))}
                    </div>
                </div>
            </AnimateOnScroll>
        </section>
    );
};

export default CommunitySection;