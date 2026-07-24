import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './PromotionBanner.module.css';

// THAY ĐỔI: Import các thư viện với tên chính xác
import ParallaxTilt from 'react-parallax-tilt';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; // Tải engine đầy đủ

// Cấu hình cho hệ thống hạt (giữ nguyên)
const particlesOptions = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 120,
    interactivity: {
        events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
        color: { value: '#ffffff' },
        links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.1, width: 1 },
        collisions: { enable: true },
        move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 0.5, straight: false },
        number: { density: { enable: true, area: 800 }, value: 80 },
        opacity: { value: 0.3 },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
};

// Component Đồng hồ đếm ngược (giữ nguyên)
const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearTimeout(timer);
    });
    return (
        <div className={styles.countdownContainer}>
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className={styles.timeBlock}>
                    <span className={styles.timeValue}>{String(value || 0).padStart(2, '0')}</span>
                    <span className={styles.timeLabel}>{unit.toUpperCase()}</span>
                </div>
            ))}
        </div>
    );
};

const teaserItems = [
    { icon: 'https://cdn-icons-png.flaticon.com/512/10493/10493026.png', title: 'VOUCHER ĐỘC QUYỀN', subtitle: 'Cho Thành Viên' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/992/992011.png', title: 'DEAL GIẢM TỚI 50%', subtitle: 'Flash Sale Mỗi Ngày' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233866.png', title: 'MÃ FREESHIP', subtitle: 'Hàng Ngày' },
];

const bannerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2, duration: 0.5 } },
};
const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const PromotionBanner = () => {
    // THAY ĐỔI: Logic khởi tạo engine của tsparticles
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    return (
        <ParallaxTilt
            tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000}
            transitionSpeed={1500} scale={1.02} gyroscope={true}
            className={styles.tiltWrapper}
        >
            <motion.header 
                className={styles.promoBanner}
                variants={bannerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Chỉ render Particles sau khi engine đã được khởi tạo */}
                {init && <Particles id="tsparticles" options={particlesOptions} className={styles.particles} />}
                
                <div className={styles.bannerInnerContainer}>
                    <div className={styles.bannerContent}>
                        <motion.div className={styles.bannerText} variants={itemVariants}>
                            <span className={styles.brandName}>ECODEAL Presents</span>
                            <h1>VŨ TRỤ SALE BÙNG NỔ</h1>
                            <Countdown targetDate="2025-08-25T00:00:00" />
                        </motion.div>

                        <motion.div className={styles.teaserContainer} variants={itemVariants}>
                            {teaserItems.map((item, index) => (
                                <div key={index} className={styles.teaserBox}>
                                    <div className={styles.shine}></div>
                                    <img src={item.icon} alt="" className={styles.teaserIcon} />
                                    <span className={styles.teaserTitle}>{item.title}</span>
                                    <span className={styles.teaserSubtitle}>{item.subtitle}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                    
                    <motion.img 
                        src="https://i.imgur.com/8a2n6A0.png"
                        alt="Mascot" 
                        className={styles.bannerMascot}
                        variants={itemVariants}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                    />
                </div>
            </motion.header>
        </ParallaxTilt>
    );
};

export default PromotionBanner;