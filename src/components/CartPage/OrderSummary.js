import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './OrderSummary.module.css';
import { FaArrowRight, FaTag } from 'react-icons/fa';
import Card from './Card';

const OrderSummary = ({ selectedItems, subTotal, shippingFee, total }) => {
    const [promoCode, setPromoCode] = useState('');
    const [promoStatus, setPromoStatus] = useState({ state: 'idle', message: '' });

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'GIAM10') {
            setPromoStatus({ state: 'success', message: 'Áp dụng mã giảm giá thành công!' });
        } else {
            setPromoStatus({ state: 'error', message: 'Mã khuyến mãi không hợp lệ.' });
        }
    };

    return (
        <Card className={styles.summaryCard}>
            {/* ... các phần khác không đổi ... */}
            <h3 className={styles.summaryTitle}>Tóm tắt đơn hàng</h3>

            <div className={styles.selectedItemsList}>
                {selectedItems.length > 0 ? (
                    selectedItems.map(item => (
                        <div key={item.id} className={styles.selectedItem}>
                            <span>{item.quantity} x {item.name}</span>
                            <span>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                        </div>
                    ))
                ) : (
                    <p className={styles.noItemsSelected}>Vui lòng chọn sản phẩm để thanh toán.</p>
                )}
            </div>
            
            <div className={styles.promoSection}>
                <div className={styles.promoCode}>
                    <FaTag className={styles.promoIcon} />
                    <input type="text" placeholder="Nhập mã khuyến mãi" className={styles.promoInput} value={promoCode}
                        onChange={(e) => {
                            setPromoCode(e.target.value);
                            if (promoStatus.state !== 'idle') setPromoStatus({ state: 'idle', message: '' });
                        }} />
                    <button onClick={handleApplyPromo} className={styles.promoButton}>Áp dụng</button>
                </div>
                {promoStatus.state !== 'idle' && (
                    <p className={`${styles.promoMessage} ${styles[promoStatus.state]}`}>{promoStatus.message}</p>
                )}
            </div>

            <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                    <span>Tạm tính</span>
                    <span>{subTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className={styles.summaryRow}>
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
            </div>

            <div className={styles.totalRow}>
                <span>Tổng cộng</span>
                <span className={styles.totalPrice}>{total.toLocaleString('vi-VN')}₫</span>
            </div>

            {/* Nút này không còn class `disabled` nữa */}
            <Link to="/checkout" className={styles.checkoutButton}>
                <span>Tiến hành đặt hàng </span>
                {/* <FaArrowRight /> */}
            </Link>
        </Card>
    );
};

export default OrderSummary;