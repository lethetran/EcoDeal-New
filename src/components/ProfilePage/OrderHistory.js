import React from 'react';
import { motion } from 'framer-motion';
import styles from './ProfileContent.module.css';
import Card from '../CartPage/Card';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { fetchUserOrders } from '../../services/cartService';

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const formatOrderDate = (createdAt) => {
    if (!createdAt) return '--/--/----';
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return '--/--/----';
    return date.toLocaleString('vi-VN');
};

const OrderHistory = () => {
    const [currentUser, setCurrentUser] = React.useState(auth.currentUser);
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        const loadOrders = async () => {
            if (!currentUser?.uid) {
                setOrders([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const userOrders = await fetchUserOrders(currentUser.uid, 50);
                setOrders(userOrders);
            } catch (error) {
                console.error('Cannot load order history:', error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [currentUser]);

    return (
        <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Card>
                <h2 className={styles.contentTitle}>Lịch sử đơn hàng</h2>
                <div className={styles.orderList}>
                    {!currentUser && <p className={styles.emptyOrderText}>Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>}
                    {currentUser && loading && <p className={styles.emptyOrderText}>Đang tải đơn hàng...</p>}
                    {currentUser && !loading && orders.length === 0 && (
                        <p className={styles.emptyOrderText}>Bạn chưa có đơn hàng nào.</p>
                    )}
                    {currentUser && !loading && orders.map((order) => {
                        const shipping = order.shippingAddress || {};
                        const receiverName = shipping.fullName || shipping.name || 'Khách hàng';
                        const receiverPhone = shipping.phone || '--';
                        const receiverAddress = shipping.fullAddress || shipping.address || '--';
                        const paymentLabel = order.paymentMethod === 'online'
                            ? 'Thanh toán Online'
                            : 'Thanh toán khi nhận hàng (COD)';
                        const items = Array.isArray(order.items) ? order.items : [];

                        return (
                            <div key={order.id} className={styles.orderCardCompact}>
                                <div className={styles.orderCompactHeader}>
                                    <span className={styles.orderId}>Đơn #{order.id}</span>
                                    <span className={styles.orderDate}>{formatOrderDate(order.createdAt)}</span>
                                </div>

                                <div className={styles.orderAddressBlock}>
                                    <p><strong>Người nhận:</strong> {receiverName}</p>
                                    <p><strong>SĐT:</strong> {receiverPhone}</p>
                                    <p><strong>Địa chỉ:</strong> {receiverAddress}</p>
                                </div>

                                <div className={styles.orderItemsCompact}>
                                    {items.length > 0 ? items.map((item, index) => (
                                        <div key={`${order.id}-${item.cartItemId || index}`} className={styles.orderItemCompactRow}>
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>{Number(item.price || 0).toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    )) : (
                                        <p className={styles.emptyOrderText}>Không có dữ liệu món trong đơn.</p>
                                    )}
                                </div>

                                <div className={styles.orderPaymentCompact}>
                                    <span><strong>Thanh toán:</strong> {paymentLabel}</span>
                                    <span><strong>Tổng:</strong> {Number(order.total || 0).toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </motion.div>
    );
};

export default OrderHistory;