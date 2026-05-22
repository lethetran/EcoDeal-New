import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import styles from './CallToActionSection.module.css';
import { Link } from 'react-router-dom';

const CallToActionSection = () => {
    return (
        <section className={styles.ctaSection}>
            <AnimateOnScroll>
                <h2>Sẵn Sàng Tham Gia Cùng Chúng Tôi?</h2>
                <p>Dù bạn là người tìm kiếm bữa ăn ngon hay một cửa hàng muốn giảm lãng phí, cánh cửa PheniFood luôn rộng mở.</p>
                <div className={styles.ctaButtons}>
    {/* Nút 1: Chuyển đến trang '/deals' */}
    <Link to="/login" className={styles.btnPrimary}>
        Tìm Ưu Đãi Ngay
    </Link>

    {/* Nút 2: Chuyển đến trang '/partner-signup' */}
    <Link to="/partner" className={styles.btnSecondary}>
        Trở Thành Đối Tác
    </Link>
</div>
            </AnimateOnScroll>
        </section>
    );
};

export default CallToActionSection;