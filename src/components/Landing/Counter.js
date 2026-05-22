// src/components/landing/Counter.js
import React, { useState, useEffect, useRef } from 'react';

const Counter = ({ target }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const counterElement = ref.current;
        if (!counterElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Bắt đầu đếm khi component hiển thị trên màn hình
                    let start = 0;
                    const end = parseInt(target, 10);
                    if (start === end) return;

                    const duration = 2000; // 2 giây
                    const startTime = Date.now();

                    const step = () => {
                        const now = Date.now();
                        const progress = Math.min((now - startTime) / duration, 1);
                        const currentCount = Math.floor(progress * end);
                        setCount(currentCount);

                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            setCount(end); // Đảm bảo số cuối cùng chính xác
                        }
                    };

                    requestAnimationFrame(step);
                    observer.unobserve(counterElement); // Chạy 1 lần rồi ngưng
                }
            },
            { threshold: 0.5 } // Kích hoạt khi 50% component hiển thị
        );

        observer.observe(counterElement);

        return () => observer.disconnect();
    }, [target]);

    return (
        <h2 ref={ref}>
            {count.toLocaleString('vi-VN')}
        </h2>
    );
};

export default Counter;