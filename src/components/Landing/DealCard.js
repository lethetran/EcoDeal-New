import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import styles from './DealCard.module.css';
import { Link } from 'react-router-dom';

const DealCard = ({ deal }) => {
    const statusClass = deal.isSoldOut ? `${styles.status} ${styles.soldOut}` : styles.status;

    return (
        <AnimateOnScroll>
            <Link to="/login" className={styles.dealCard}>
                <img src={deal.image} alt={deal.title} />
                <div className={styles.cardContent}>
                    <h3>{deal.title}</h3>
                    <div className={styles.cardInfo}>
                        <p className={styles.storeName}>{deal.store}</p>
                        <p className={styles.price}>
                            <span className={styles.originalPrice}>{deal.originalPrice}đ</span>
                            <span className={styles.dealPrice}>{deal.dealPrice}đ</span>
                        </p>
                        <p className={statusClass}>{deal.statusText}</p>
                    </div>
                </div>
            </Link>
        </AnimateOnScroll>
    );
};

export default DealCard;