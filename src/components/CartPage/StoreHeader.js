import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaClock } from 'react-icons/fa';
import styles from './StoreHeader.module.css';

const StoreHeader = ({ store }) => {
    return (
        <div className={styles.storeHeader}>
            {/* Tên cửa hàng giờ là một Link */}
            <Link to={`/store/${store.id}`} className={styles.storeInfoLink}>
                <div className={styles.storeInfo}>
                    <FaStore className={styles.icon} />
                    <h3 className={styles.storeName}>{store.name}</h3>
                </div>
            </Link>
            <div className={styles.deliveryInfo}>
                <FaClock className={styles.icon} />
                <span>Giao hàng dự kiến: {store.deliveryTime}</span>
            </div>
        </div>
    );
};

export default StoreHeader;