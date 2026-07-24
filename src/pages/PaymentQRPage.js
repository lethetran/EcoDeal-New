// src/pages/PaymentQRPage/PaymentQRPage.jsx (Phiên bản Hoàn chỉnh sau khi điều chỉnh)

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PaymentQRPage.module.css';
import useCountdown from '../hooks/useCountdown'; // Giả sử bạn có hook này
import { FaQrcode, FaCopy, FaInfoCircle, FaRedo } from 'react-icons/fa';
import Header from '../components/Header/Header'; 
import Footer from '../components/Footer/Footer';
// Link logo công khai
const VietQRLogo = "/placeholders/deal-placeholder.svg";
const MomoLogo = "/placeholders/deal-placeholder.svg";
const ZaloPayLogo = "/placeholders/deal-placeholder.svg";

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
    const { minutes, seconds, isExpired, reset } = useCountdown(600); // Giả sử hook có hàm reset
    const [status, setStatus] = useState('waiting'); // 'waiting', 'success', 'expired'


    const qrCodeUrl = useMemo(() => activeMethod.getQRUrl(orderInfo), [activeMethod]);
    
    useEffect(() => {
        if (isExpired && status === 'waiting') {
            setStatus('expired');
        }
    }, [isExpired, status]);


    const handleCopy = (text) => navigator.clipboard.writeText(text);

    return (
        <>
            <Header  />
            <div className={styles.pageWrapper}>
                <div className={styles.backgroundShapes}>
                    <motion.div className={`${styles.shape} ${styles.shape1}`} animate={{ y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.div className={`${styles.shape} ${styles.shape2}`} animate={{ y: [0, 20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
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

                        <div className={styles.qrDisplayArea}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeMethod.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <p className={styles.instruction}>Quét mã bằng <strong>{activeMethod.name}</strong> để hoàn tất</p>
                                    <div className={`${styles.qrCodeWrapper} ${isExpired ? styles.expired : ''}`}>
                                        <img src={qrCodeUrl} alt={`Mã QR ${activeMethod.name}`} />
                                        {isExpired && (
                                            <div className={styles.expiredOverlay}>
                                                <FaRedo/>
                                                <span>Mã đã hết hạn</span>
                                                <button onClick={() => { setStatus('waiting'); reset(); }}>Tạo lại</button>
                                            </div>
                                        )}
                                    </div>
                                    {!isExpired && <p className={styles.countdown}>Hết hạn trong: <strong>{minutes}:{seconds}</strong></p>}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <p className={styles.mainAmount}>{orderInfo.amount.toLocaleString('vi-VN')}₫</p>
                                    
                        <div className={styles.methodSelectorWrapper}>
                            <p className={styles.methodSelectorTitle}>Hoặc chọn phương thức khác</p>
                            <div className={styles.methodSelector}>
                                {paymentMethods.map(method => (
                                    <button key={method.id} className={`${styles.methodButton} ${activeMethod.id === method.id ? styles.active : ''}`} onClick={() => setActiveMethod(method)}>
                                        <img src={method.logo} alt={method.name} />
                                        {/* Tên phương thức được ẩn đi để giống hình mẫu, nhưng bạn có thể thêm lại nếu muốn */}
                                        {/* <span>{method.name}</span> */}
                                    </button>
                                ))}
                            </div>
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
                            <span>Gặp sự cố? <a href="mailto:support@phenifood.vn">Liên hệ hỗ trợ</a></span>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </>
    );
};

export default PaymentQRPage;