import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import ProductCard from '../components/ProductCard/ProductCard';
import Footer from '../components/Footer/Footer';
import VerifiedBadge from '../components/VerifiedBadge/VerifiedBadge';
import { FaStar } from 'react-icons/fa';

// Import CSS Module đúng cách
import styles from './Product.module.css';
import { fetchDealById, fetchLatestDeals } from '../services/dealService';
import { fetchDealReviews, fetchSellerRatingSummary, submitDealReview } from '../services/reviewService';
import { useCart } from '../hooks/useCart';
import { auth } from '../firebase-config';

const FALLBACK_IMAGE = '/placeholders/deal-placeholder.svg';

const computeFinalPrice = (deal) => {
  const discount = Math.max(0, Math.min(100, Number(deal?.dealPercentage || 0)));
  const originalPrice = Math.max(0, Number(deal?.salePrice || 0));
  return Math.round(originalPrice * (1 - discount / 100));
};

const toProductCardShape = (deal) => ({
  id: deal.id,
  name: deal.productName,
  price: computeFinalPrice(deal),
  originalPrice: Number(deal.salePrice || 0),
  img: deal.mainImage || FALLBACK_IMAGE,
  stock: deal.quantity,
  store: {
    id: deal.ownerUid,
    name: deal.ownerDisplayName || deal.ownerEmail || 'Cộng đồng Ecodeal',
  },
});

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handlers } = useCart();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [moreFromStore, setMoreFromStore] = useState([]);
  const [otherDeals, setOtherDeals] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [sellerRating, setSellerRating] = useState({ average: 0, count: 0 });
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setDeal(null);

    fetchDealById(id)
      .then((fetchedDeal) => {
        if (cancelled) return;
        if (!fetchedDeal) {
          setNotFound(true);
          return;
        }
        setDeal(fetchedDeal);
        setCurrentImage(fetchedDeal.mainImage || FALLBACK_IMAGE);
        setQuantity(1);
      })
      .catch((error) => {
        console.error('Cannot load deal:', error);
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!deal) return;
    let cancelled = false;

    fetchLatestDeals(30)
      .then((deals) => {
        if (cancelled) return;
        const others = deals.filter((d) => d.id !== deal.id);
        setMoreFromStore(
          others.filter((d) => d.ownerUid === deal.ownerUid).slice(0, 4).map(toProductCardShape)
        );
        setOtherDeals(
          others.filter((d) => d.ownerUid !== deal.ownerUid).slice(0, 4).map(toProductCardShape)
        );
      })
      .catch((error) => console.error('Cannot load related deals:', error));

    return () => {
      cancelled = true;
    };
  }, [deal]);

  useEffect(() => {
    if (!deal) return;
    let cancelled = false;

    fetchDealReviews(deal.id)
      .then((dealReviews) => { if (!cancelled) setReviews(dealReviews); })
      .catch((error) => console.error('Cannot load reviews:', error));

    fetchSellerRatingSummary(deal.ownerUid)
      .then((summary) => { if (!cancelled) setSellerRating(summary); })
      .catch((error) => console.error('Cannot load seller rating:', error));

    return () => {
      cancelled = true;
    };
  }, [deal]);

  const thumbnails = useMemo(() => {
    if (!deal) return [];
    const images = Array.isArray(deal.allImages) && deal.allImages.length > 0
      ? deal.allImages
      : [deal.mainImage || FALLBACK_IMAGE];
    return images;
  }, [deal]);

  const finalPrice = deal ? computeFinalPrice(deal) : 0;
  const storeName = deal?.ownerDisplayName || deal?.ownerEmail || 'Cộng đồng Ecodeal';

  const handleThumbnailClick = (thumbSrc) => {
    setCurrentImage(thumbSrc);
  };

  const handleChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleAddToCart = async () => {
    if (!deal) return;
    setAddingToCart(true);
    try {
      await handlers.handleAddDealToCart(deal, quantity);
    } catch (error) {
      console.error('Cannot add to cart:', error);
      alert('Không thể thêm vào giỏ hàng, vui lòng thử lại.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!deal) return;
    setAddingToCart(true);
    try {
      await handlers.handleAddDealToCart(deal, quantity);
      navigate('/checkout');
    } catch (error) {
      console.error('Cannot add to cart:', error);
      alert('Không thể thêm vào giỏ hàng, vui lòng thử lại.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('Bạn cần đăng nhập để đánh giá sản phẩm.');
      navigate('/login');
      return;
    }

    if (auth.currentUser.uid === deal.ownerUid) {
      alert('Bạn không thể tự đánh giá bài đăng của chính mình.');
      return;
    }

    if (!newReviewText.trim() || newReviewRating === 0) {
      alert('Vui lòng nhập nhận xét và chọn số sao nhé!');
      return;
    }

    setIsSubmitting(true);
    try {
      const authorName = (auth.currentUser.displayName || '').trim()
        || (auth.currentUser.email || '').split('@')[0]
        || 'Ẩn danh';

      await submitDealReview(deal.id, deal.ownerUid, auth.currentUser.uid, {
        rating: newReviewRating,
        comment: newReviewText,
        authorName,
      });

      const [dealReviews, summary] = await Promise.all([
        fetchDealReviews(deal.id),
        fetchSellerRatingSummary(deal.ownerUid),
      ]);
      setReviews(dealReviews);
      setSellerRating(summary);
      setNewReviewText('');
      setNewReviewRating(5);
    } catch (error) {
      console.error('Cannot submit review:', error);
      alert('Không thể gửi đánh giá lúc này, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <p style={{ textAlign: 'center', padding: '80px 0' }}>Đang tải sản phẩm...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !deal) {
    return (
      <>
        <Header />
        <main>
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h2>Không tìm thấy sản phẩm</h2>
            <p>Ưu đãi này có thể đã hết hạn hoặc đã bị gỡ bỏ.</p>
            <Link to="/home">Quay lại trang chủ</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <section className={`${styles['product-detail']} ${styles.section}`}>
            <div className={`${styles.container} ${styles.grid} ${styles['product-detail__container']}`}>
                <div className={styles['product-detail__gallery']}>
                    <div className={styles['gallery__main-image']}>
                        <img src={currentImage} alt={deal.productName} />
                    </div>
                    {thumbnails.length > 1 && (
                      <div className={styles['gallery__thumbnails']}>
                          {thumbnails.map((thumbSrc, index) => (
                            <div key={index} className={styles.thumbnail} onClick={() => handleThumbnailClick(thumbSrc)}>
                              <img src={thumbSrc} alt={`Thumbnail ${index + 1}`} />
                            </div>
                          ))}
                      </div>
                    )}
                </div>

                <div className={styles['product-detail__info']}>
                    <h1 className={styles.info__title}>{deal.productName}</h1>
                    <div className={styles.info__store_meta}>
                      <Link to={`/store/${deal.ownerUid}`} className={styles['store_meta__name']}>
                            <i className='bx bxs-store-alt'></i>
                            <span>{storeName}</span>
                      </Link>
                      {sellerRating.count > 0 && (
                        <span className={styles['seller-trust-badge']}>
                          <i className='bx bxs-star'></i>
                          {sellerRating.average.toFixed(1)} · {sellerRating.count} đánh giá
                        </span>
                      )}
                    </div>
                    <div className={styles.info__price}>
                        <span className={styles['price--new']}>{finalPrice.toLocaleString('vi-VN')}đ</span>
                        {deal.dealPercentage > 0 && (
                          <>
                            <span className={styles['price--old']}>{Number(deal.salePrice || 0).toLocaleString('vi-VN')}đ</span>
                            <span className={styles['price__discount-badge']}>- {deal.dealPercentage}%</span>
                          </>
                        )}
                    </div>

                    <div className={styles.info__description}>
                      {deal.ecoCheckApproved ? (
                        <VerifiedBadge label={deal.aiCheckLabel || 'Đã kiểm duyệt AI'} size="lg" />
                      ) : (
                        <span className={styles['not-verified-note']}>⏳ Chưa được hệ thống AI xác minh chất lượng</span>
                      )}
                    </div>

                    <div className={styles.info__quantity}>
                        <label>Số lượng</label>
                        <div
  className={`${styles['quantity-selector']} ${isAnimating ? styles.pulse : ''}`}
>
    <span className={styles['quantity-control']} onClick={() => handleChange(-1)}>-</span>
    <span className={styles['quantity-display']}>{quantity}</span>
    <span className={styles['quantity-control']} onClick={() => handleChange(1)}>+</span>
</div>
                    </div>

                    <div className={styles.info__actions}>
                        <button
                          className={`${styles.btn} ${styles['btn--secondary']}`}
                          onClick={handleAddToCart}
                          disabled={addingToCart}
                        >
                            <i className='bx bx-cart-add'></i>
                            <span>{addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}</span>
                        </button>
                        <button
                          className={`${styles.btn} ${styles['btn--primary']}`}
                          onClick={handleBuyNow}
                          disabled={addingToCart}
                        >
                          Mua ngay
                        </button>
                    </div>

                </div>
            </div>
        </section>

        <div className={`${styles.container} ${styles['product-extra-info']}`}>
            {moreFromStore.length > 0 && (
              <section className={styles['product-section']}>
                  <h2 className={styles.section__title}>Sản phẩm khác của {storeName}</h2>
                  <div className={styles['cross-sell-grid']}>
                      {moreFromStore.map(item => (
                          <ProductCard key={item.id} product={item} />
                      ))}
                  </div>
              </section>
            )}

            <section className={styles['product-section']}>
                <h2 className={styles.section__title}>Phản hồi</h2>
                <div className={styles.reviews__container}>
                    {reviews.length === 0 ? (
                      <p>Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm!</p>
                    ) : reviews.map(review => (
                        <div key={review.id} className={styles['review-card']}>
                            <div className={styles['review-header']}>
                                <div className={styles['review-rating']}>
                                    {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                                </div>
                                <span className={styles['review-author']}>{review.authorName}</span>
                            </div>
                            <p className={styles['review-comment']}>"{review.comment}"</p>
                        </div>
                    ))}
                </div>

                <div className={styles['review-form-card']}>
                    <h3 className={styles['form-title']}>Chia sẻ trải nghiệm giải cứu của bạn</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className={styles['rating-input-container']}>
                            <span>Đánh giá của bạn:</span>
                            <div className={styles['stars-wrapper']} onMouseLeave={() => setHoverRating(0)}>
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <button
                                            type="button"
                                            key={starValue}
                                            className={`${styles.starIcon} ${starValue <= (hoverRating || newReviewRating) ? styles.active : ''}`}
                                            onClick={() => setNewReviewRating(starValue)}
                                            onMouseEnter={() => setHoverRating(starValue)}
                                        >
                                            <FaStar />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <textarea
                            className={styles['review-textarea']}
                            rows="1"
                            placeholder="Sản phẩm có ngon không, bạn có hài lòng với cuộc giải cứu này không?..."
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                        />
                        <button type="submit" className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--submit-review']}`} disabled={isSubmitting}>
                            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </form>
                </div>
            </section>

             {otherDeals.length > 0 && (
              <section className={styles['product-section']}>
                  <h2 className={styles.section__title}>Có thể bạn quan tâm</h2>
                  <div className={styles['cross-sell-grid']}>
                      {otherDeals.map(item => (
                          <ProductCard key={item.id} product={item} />
                      ))}
                  </div>
              </section>
            )}
        </div>
      </main>
        <Footer />
    </>
  );
}

export default ProductDetailPage;
