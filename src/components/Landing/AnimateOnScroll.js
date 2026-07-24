import React, { useEffect, useRef, useState } from 'react';
import styles from './AnimateOnScroll.module.css';

const AnimateOnScroll = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
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

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
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