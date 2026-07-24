// src/pages/OrderDetailPage/OrderDetailPage.jsx

import React from 'react';
import styles from './OrderDetailPage.module.css';
import { FaBoxOpen, FaMotorcycle, FaHome, FaRegClock, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import Header from '../components/Header/Header';
import PageHeader from '../components/CartPage/PageHeader'; 
import Card from '../components/CartPage/Card'; 
import Footer from '../components/Footer/Footer'; // Import Footer component

// Dữ liệu mẫu
const orderData = {
    id: '#123456',
    date: '20/06/2025',
    statusHistory: [
        { status: 'Đã đặt hàng', time: '10:30 20/06/2025', icon: <FaRegClock />, done: true },
        { status: 'Cửa hàng đang chuẩn bị', time: '10:35 20/06/2025', icon: <FaBoxOpen />, done: true },
        { status: 'Đang giao hàng', time: '11:00 20/06/2025', icon: <FaMotorcycle />, done: true },
        { status: 'Đã giao hàng', time: '11:25 20/06/2025', icon: <FaHome />, done: true },
    ],
    items: [
        { id: 1, name: 'Burger Bò Đặc Biệt', quantity: 1, price: 89000, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100' },
        { id: 2, name: 'Coca Cola', quantity: 2, price: 15000, imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=100' }
    ],
    payment: {
        method: 'Thanh toán khi nhận hàng (COD)',
        subtotal: 119000,
        shipping: 15000,
        total: 134000,
    },
    address: '123 Đường ABC, Phường Cầu Ông Lãnh, Quận 1, TP.HCM',
};

const OrderDetailPage = () => {
    return (
        <>
        <Header />
        <div className={styles.pageContainer}>
            <PageHeader
                title={`Chi tiết đơn hàng`}
                subtitle={`Mã đơn hàng: ${orderData.id} - Ngày đặt: ${orderData.date}`}
            />
            
            <div className={styles.mainLayout}>
                <div className={styles.leftColumn}>
                    <Card>
                        <h3 className={styles.cardTitle}><FaMotorcycle /> Trạng thái đơn hàng</h3>
                        <div className={styles.timeline}>
                            {orderData.statusHistory.map((item, index) => (
                                <div key={index} className={`${styles.timelineItem} ${item.done ? styles.done : ''}`}>
                                    <div className={styles.timelineConnector}>
                                        <div className={styles.timelineIconWrapper}>
                                            <div className={styles.timelineIcon}>{item.icon}</div>
                                        </div>
                                    </div>
                                    <div className={styles.timelineContent}>
                                        <strong>{item.status}</strong>
                                        <p>{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                         <h3 className={styles.cardTitle}><FaBoxOpen /> Các món đã đặt</h3>
                         <div className={styles.orderItemsList}>
                            {orderData.items.map(item => (
                                <div key={item.id} className={styles.orderItem}>
                                    <img src={item.imageUrl} alt={item.name} className={styles.itemImage}/>
                                    <div className={styles.itemDetails}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        <span className={styles.itemQuantity}>Số lượng: {item.quantity}</span>
                                    </div>
                                    <span className={styles.itemPrice}>{(item.quantity * item.price).toLocaleString('vi-VN')}₫</span>
                                </div>
                            ))}
                         </div>
                    </Card>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.stickyCard}>
                        <Card>
                            <h3 className={styles.cardTitle}><FaMapMarkerAlt /> Giao đến</h3>
                            <p className={styles.addressText}>{orderData.address}</p>
                        </Card>
                        
                        <Card>
                            <h3 className={styles.cardTitle}><FaCreditCard /> Thanh toán</h3>
                            <div className={styles.paymentDetails}>
                                <div className={styles.summaryRow}>
                                    <span>Phương thức</span>
                                    <span>{orderData.payment.method}</span>
                                </div>
                                 <div className={styles.summaryRow}>
                                    <span>Tạm tính</span>
                                    <span>{orderData.payment.subtotal.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Phí vận chuyển</span>
                                    <span>{orderData.payment.shipping.toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Tổng cộng</span>
                                <span className={styles.totalPrice}>{orderData.payment.total.toLocaleString('vi-VN')}₫</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default OrderDetailPage;