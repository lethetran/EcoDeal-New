import React, { useEffect, useRef, useState } from 'react';
import styles from './AnimateOnScroll.module.css';

const AnimateOnScroll = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // Chạy 1 lần rồi ngưng
                }
            },
            {
                threshold: 0.1, // Kích hoạt khi 10% phần tử hiển thị
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const classes = `${styles.animateOnScroll} ${isVisible ? styles.visible : ''}`;

    return (
        <div ref={ref} className={classes}>
            {children}
        </div>
    );
};

export default AnimateOnScroll;