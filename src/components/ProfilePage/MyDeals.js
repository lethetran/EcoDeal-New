import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './ProfileContent.module.css';
import Card from '../CartPage/Card';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { fetchDealsByOwner } from '../../services/dealService';
import { fetchSellerReviews, summarizeRatings } from '../../services/reviewService';

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const StarRating = ({ value }) => {
    const rounded = Math.round(Number(value) || 0);
    return (
        <span className={styles.starRow} aria-label={`${value} trên 5 sao`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <i key={star} className={`bx ${star <= rounded ? 'bxs-star' : 'bx-star'}`}></i>
            ))}
        </span>
    );
};

const MyDeals = () => {
    const [currentUser, setCurrentUser] = React.useState(auth.currentUser);
    const [deals, setDeals] = React.useState([]);
    const [reviewsByDeal, setReviewsByDeal] = React.useState({});
    const [sellerSummary, setSellerSummary] = React.useState({ average: 0, count: 0 });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        const loadMyDeals = async () => {
            if (!currentUser?.uid) {
                setDeals([]);
                setReviewsByDeal({});
                setSellerSummary({ average: 0, count: 0 });
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const [myDeals, sellerReviews] = await Promise.all([
                    fetchDealsByOwner(currentUser.uid),
                    fetchSellerReviews(currentUser.uid),
                ]);

                setDeals(myDeals);
                setSellerSummary(summarizeRatings(sellerReviews));

                const grouped = {};
                sellerReviews.forEach((review) => {
                    if (!grouped[review.dealId]) grouped[review.dealId] = [];
                    grouped[review.dealId].push(review);
                });
                setReviewsByDeal(grouped);
            } catch (error) {
                console.error('Cannot load posted deals:', error);
                setDeals([]);
            } finally {
                setLoading(false);
            }
        };

        loadMyDeals();
    }, [currentUser]);

    return (
        <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Card>
                <h2 className={styles.contentTitle}>Bài đã đăng</h2>

                {currentUser && !loading && deals.length > 0 && (
                    <div className={styles.sellerTrustBanner}>
                        <StarRating value={sellerSummary.average} />
                        <div>
                            <strong>{sellerSummary.count > 0 ? sellerSummary.average.toFixed(1) : 'Chưa có đánh giá'}</strong>
                            <span> · {sellerSummary.count} lượt đánh giá · Điểm uy tín người bán trên tất cả bài đăng</span>
                        </div>
                    </div>
                )}

                <div className={styles.orderList}>
                    {!currentUser && <p className={styles.emptyOrderText}>Bạn cần đăng nhập để xem bài đã đăng.</p>}
                    {currentUser && loading && <p className={styles.emptyOrderText}>Đang tải bài đã đăng...</p>}
                    {currentUser && !loading && deals.length === 0 && (
                        <p className={styles.emptyOrderText}>Bạn chưa đăng ưu đãi nào.</p>
                    )}
                    {currentUser && !loading && deals.map((deal) => {
                        const dealReviews = reviewsByDeal[deal.id] || [];
                        const dealSummary = summarizeRatings(dealReviews);
                        const isExpired = deal.expiryAt ? new Date(deal.expiryAt).getTime() < Date.now() : false;

                        return (
                            <Link key={deal.id} to={`/products/${deal.id}`} className={styles.dealCardCompact}>
                                <img src={deal.mainImage} alt={deal.productName} className={styles.dealThumb} />
                                <div className={styles.dealInfo}>
                                    <div className={styles.dealCompactHeader}>
                                        <span className={styles.dealName}>{deal.productName}</span>
                                        <span className={`${styles.dealStatusPill} ${isExpired ? styles.dealStatusExpired : styles.dealStatusActive}`}>
                                            {isExpired ? 'Đã hết hạn' : 'Đang hiển thị'}
                                        </span>
                                    </div>
                                    <div className={styles.dealMetaRow}>
                                        <span>{Number(deal.salePrice || 0).toLocaleString('vi-VN')}đ · -{deal.dealPercentage || 0}%</span>
                                        <span>
                                            {dealSummary.count > 0
                                                ? `⭐ ${dealSummary.average.toFixed(1)} (${dealSummary.count} đánh giá)`
                                                : 'Chưa có đánh giá'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </Card>
        </motion.div>
    );
};

export default MyDeals;
