import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import styles from './ProfileContent.module.css';
import Card from '../CartPage/Card';

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Dữ liệu mẫu
const orders = [
    { id: '#123456', date: '20/06/2025', total: 134000, status: 'Đã giao hàng' },
    { id: '#123455', date: '18/06/2025', total: 89000, status: 'Đang xử lý' },
];

const OrderHistory = () => (
    <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
    >
        <Card>
            <h2 className={styles.contentTitle}>Lịch sử đơn hàng</h2>
            <div className={styles.orderList}>
                {orders.map(order => (
                    <div key={order.id} className={styles.orderItem}>
                        <div className={styles.orderInfo}>
                            <span className={styles.orderId}>{order.id}</span>
                            <span className={styles.orderDate}>{order.date}</span>
                        </div>
                        <span className={styles.orderTotal}>{order.total.toLocaleString('vi-VN')}₫</span>
                        <span className={`${styles.orderStatus} ${order.status === 'Đã giao hàng' ? styles.completed : styles.processing}`}>
                            {order.status === 'Đã giao hàng' ? <FaCheckCircle /> : <FaSpinner className={styles.spinner} />}
                            {order.status}
                        </span>
                        <Link to={`/order/${order.id.replace('#', '')}`} className={styles.viewDetailButton}>
                            Xem chi tiết
                        </Link>
                    </div>
                ))}
            </div>
        </Card>
    </motion.div>
);

export default OrderHistory;