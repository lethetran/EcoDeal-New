// src/pages/PaymentQRPage/PaymentQRPage.jsx (Phiên bản Hybrid)

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PaymentQRPage.module.css';
import useCountdown from '../../hooks/useCountdown';
import { FaQrcode, FaShieldAlt, FaCopy, FaCheck, FaInfoCircle } from 'react-icons/fa';

// Link logo
const VietQRLogo = "https://seeklogo.com/images/V/vietqr-logo-1M4A22103C-seeklogo.com.png";
const MomoLogo = "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png";
const ZaloPayLogo = "https://seeklogo.com/images/Z/zalopay-logo-6VP0A62D71-seeklogo.com.png";

const orderInfo = {
    id: '#123456',
    items: 'Burger Bò Đặc Biệt, Coca-Cola, Khoai tây chiên cỡ lớn',
    amount: 134000,
    description: 'PAY123456'
};

const bankInfo = {
    accountNumber: '0123456789',
    accountName: 'CONG TY CP PHENI',
};

const paymentMethods = [
    { id: 'vietqr', name: 'App Ngân hàng', logo: VietQRLogo, getQRUrl: (info) => `https://api.vietqr.io/image/970436-${bankInfo.accountNumber}-compact.png?amount=${info.amount}&addInfo=${encodeURIComponent(info.description)}` },
    { id: 'momo', name: 'Ví MoMo', logo: MomoLogo, getQRUrl: (info) => `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MOMO_${info.amount}` },
    { id: 'zalopay', name: 'ZaloPay', logo: ZaloPayLogo, getQRUrl: (info) => `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZALOPAY_${info.amount}` },
];

const PaymentQRPage = () => {
    const [activeMethod, setActiveMethod] = useState(paymentMethods[0]);
    const { minutes, seconds, isExpired } = useCountdown(600);

    const qrCodeUrl = useMemo(() => activeMethod.getQRUrl(orderInfo), [activeMethod]);

    const handleCopy = (text) => navigator.clipboard.writeText(text);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.backgroundShapes}>
                <motion.div className={`${styles.shape} ${styles.shape1}`} /* ... */ />
                <motion.div className={`${styles.shape} ${styles.shape2}`} /* ... */ />
            </div>

            <motion.div
                className={styles.paymentLayout}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                {/* === CỘT TRÁI: THANH TOÁN === */}
                <div className={styles.paymentSection}>
                    <div className={styles.header}>
                        <FaQrcode />
                        <h2>Thanh toán đơn hàng</h2>
                    </div>
                    
                    <p className={styles.mainAmount}>{orderInfo.amount.toLocaleString('vi-VN')}₫</p>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeMethod.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                        >
                            <p className={styles.instruction}>Quét mã bằng <strong>{activeMethod.name}</strong> để hoàn tất</p>
                            <div className={styles.qrCodeWrapper}>
                                <img src={qrCodeUrl} alt={`Mã QR ${activeMethod.name}`} />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    
                    {!isExpired && <p className={styles.countdown}>Hết hạn trong: <strong>{minutes}:{seconds}</strong></p>}
                    
                    <div className={styles.methodSelector}>
                        {paymentMethods.map(method => (
                            <button key={method.id} className={`${styles.methodButton} ${activeMethod.id === method.id ? styles.active : ''}`} onClick={() => setActiveMethod(method)}>
                                <img src={method.logo} alt={method.name} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* === CỘT PHẢI: TÓM TẮT & THÔNG TIN THÊM === */}
                <div className={styles.summarySection}>
                    <h3>Tóm tắt đơn hàng</h3>
                    <div className={styles.summaryItem}>
                        <span>Mã đơn hàng</span>
                        <strong>{orderInfo.id}</strong>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Sản phẩm</span>
                        <p>{orderInfo.items}</p>
                    </div>
                    <div className={styles.summaryTotal}>
                        <span>Tổng thanh toán</span>
                        <strong>{orderInfo.amount.toLocaleString('vi-VN')}₫</strong>
                    </div>
                    
                    <div className={styles.manualTransfer}>
                        <h4>Chuyển khoản thủ công</h4>
                        <div className={styles.infoRow}>
                            <span>Số tài khoản</span>
                            <div>
                                <strong>{bankInfo.accountNumber}</strong>
                                <button onClick={() => handleCopy(bankInfo.accountNumber)}><FaCopy /></button>
                            </div>
                        </div>
                        <div className={styles.infoRow}>
                            <span>Nội dung</span>
                            <div>
                                <strong>{orderInfo.description}</strong>
                                <button onClick={() => handleCopy(orderInfo.description)}><FaCopy /></button>
                            </div>
                        </div>
                    </div>

                     <div className={styles.supportInfo}>
                        <FaInfoCircle />
                        <span>Gặp sự cố? <a href="#">Liên hệ hỗ trợ</a></span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentQRPage;