import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Sử dụng Link của React Router
import styles from './Header.module.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function để gỡ event listener khi component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Kết hợp class động bằng template literal
    const navbarClasses = `${styles.navbar} ${isScrolled ? styles.scrolled : ''}`;

    return (
        <header className={navbarClasses}>
            <a href="#" className={styles.logo}>PheniFood</a>
            <nav>
                <a href="#deals-gallery">ƯU ĐÃ HÔM NAY</a>
                <a href="/about">CÂU CHUYỆN</a>
                <a href="/store">CỬA HÀNG ĐỐI TÁC</a>
            </nav>
            <div className={styles.userActions}>
                {/* Sử dụng Link của React Router cho các trang nội bộ */}
                <Link to="/login" className={styles.btnSecondary}>Đăng Nhập</Link>
                <Link to="/login" className={styles.btnPrimary}>Đăng Ký</Link>
            </div>
        </header>
    );
};

export default Header;