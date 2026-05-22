// src/components/landing/ImpactSection.js
import React from 'react';
import Counter from './Counter'; // Import component Counter
import '../../hooks/useOnScreen';
import styles from './ImpactSection.module.css';

const statsData = [
    { target: "12345", label: "Bữa Ăn Đã Cứu" },
    { target: "3890", label: "Kg Thực Phẩm" },
    { target: "125", label: "Cửa Hàng Đồng Hành" }
];

const ImpactSection = () => {
    return (
        <section className={styles.impactSection}>
            <div className={styles.impactOverlay}></div>
            <div className={styles.impactContent}>
                {statsData.map((stat, index) => (
                    <div className={styles.statItem} key={index}>
                        <Counter target={stat.target} />
                        <p>{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ImpactSection;