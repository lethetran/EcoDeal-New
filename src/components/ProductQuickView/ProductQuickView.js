import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './ProductQuickView.css';
import { auth } from '../../firebase-config';
import { useCart } from '../../hooks/useCart';
import {
  fetchDealReviews,
  fetchSellerRatingSummary,
  replyToReview,
  submitDealReview,
} from '../../services/reviewService';
import VerifiedBadge from '../VerifiedBadge/VerifiedBadge';
import Toast from '../Toast/Toast';

const FALLBACK_IMAGE = '/placeholders/deal-placeholder.svg';

const computeFinalPrice = (deal) => {
  const discount = Math.max(0, Math.min(100, Number(deal?.dealPercentage || 0)));
  const originalPrice = Math.max(0, Number(deal?.salePrice || 0));
  return Math.round(originalPrice * (1 - discount / 100));
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN');
};

const StarPicker = ({ value, hoverValue, onPick, onHover, onLeave }) => (
  <div className="qv-star-picker" onMouseLeave={onLeave}>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        type="button"
        key={star}
        className={`qv-star-btn ${star <= (hoverValue || value) ? 'active' : ''}`}
        onClick={() => onPick(star)}
        onMouseEnter={() => onHover(star)}
      >
        <FaStar />
      </button>
    ))}
  </div>
);

const ProductQuickView = ({ deal, onClose }) => {
  const { handlers } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [sellerRating, setSellerRating] = useState({ average: 0, count: 0 });

  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [replyDrafts, setReplyDrafts] = useState({});
  const [submittingReplyId, setSubmittingReplyId] = useState(null);

  const currentUser = auth.currentUser;
  const isOwner = currentUser?.uid === deal.ownerUid;
  const finalPrice = computeFinalPrice(deal);
  const storeName = deal.ownerDisplayName || deal.ownerEmail || 'Cộng đồng Ecodeal';

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setReviewsLoading(true);

    fetchDealReviews(deal.id)
      .then((dealReviews) => { if (!cancelled) setReviews(dealReviews); })
      .catch((error) => console.error('Cannot load reviews:', error))
      .finally(() => { if (!cancelled) setReviewsLoading(false); });

    fetchSellerRatingSummary(deal.ownerUid)
      .then((summary) => { if (!cancelled) setSellerRating(summary); })
      .catch((error) => console.error('Cannot load seller rating:', error));

    return () => { cancelled = true; };
  }, [deal.id, deal.ownerUid]);

  const refreshReviews = async () => {
    const [dealReviews, summary] = await Promise.all([
      fetchDealReviews(deal.id),
      fetchSellerRatingSummary(deal.ownerUid),
    ]);
    setReviews(dealReviews);
    setSellerRating(summary);
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await handlers.handleAddDealToCart(deal, quantity);
      setToast({ show: true, message: '✅ Đã thêm vào giỏ hàng' });
    } catch (error) {
      console.error('Cannot add to cart:', error);
      setToast({ show: true, message: '❌ Không thể thêm vào giỏ hàng, thử lại nhé' });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Bạn cần đăng nhập để đánh giá sản phẩm.');
      return;
    }
    if (isOwner) {
      alert('Bạn không thể tự đánh giá bài đăng của chính mình.');
      return;
    }
    if (!newReviewText.trim() || newReviewRating === 0) {
      alert('Vui lòng nhập nhận xét và chọn số sao nhé!');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const authorName = (currentUser.displayName || '').trim()
        || (currentUser.email || '').split('@')[0]
        || 'Ẩn danh';

      await submitDealReview(deal.id, deal.ownerUid, currentUser.uid, {
        rating: newReviewRating,
        comment: newReviewText,
        authorName,
      });

      await refreshReviews();
      setNewReviewText('');
      setNewReviewRating(5);
    } catch (error) {
      console.error('Cannot submit review:', error);
      alert('Không thể gửi đánh giá lúc này, vui lòng thử lại.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSubmitReply = async (reviewId) => {
    const text = (replyDrafts[reviewId] || '').trim();
    if (!text) return;

    setSubmittingReplyId(reviewId);
    try {
      await replyToReview(reviewId, text);
      const dealReviews = await fetchDealReviews(deal.id);
      setReviews(dealReviews);
      setReplyDrafts((prev) => ({ ...prev, [reviewId]: '' }));
    } catch (error) {
      console.error('Cannot submit reply:', error);
      alert('Không thể gửi phản hồi lúc này, vui lòng thử lại.');
    } finally {
      setSubmittingReplyId(null);
    }
  };

  return (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="qv-close" onClick={onClose} aria-label="Đóng">✕</button>

        <div className="qv-body">
          <div className="qv-top">
            <div className="qv-image-wrap">
              <img src={deal.mainImage || deal.allImages?.[0] || FALLBACK_IMAGE} alt={deal.productName} />
              {deal.dealPercentage > 0 && (
                <span className="qv-discount-badge">-{deal.dealPercentage}%</span>
              )}
            </div>

            <div className="qv-info">
              <h2 className="qv-title">{deal.productName}</h2>

              <div className="qv-seller-row">
                <span className="qv-seller-name">
                  <i className="bx bxs-store-alt"></i> {storeName}
                </span>
                {sellerRating.count > 0 && (
                  <span className="qv-seller-rating">
                    <i className="bx bxs-star"></i> {sellerRating.average.toFixed(1)} ({sellerRating.count})
                  </span>
                )}
              </div>

              <div className="qv-price-row">
                <span className="qv-price-new">{finalPrice.toLocaleString('vi-VN')}đ</span>
                {deal.dealPercentage > 0 && (
                  <span className="qv-price-old">{Number(deal.salePrice || 0).toLocaleString('vi-VN')}đ</span>
                )}
              </div>

              <div className="qv-verify-row">
                {deal.ecoCheckApproved ? (
                  <VerifiedBadge label={deal.aiCheckLabel || 'Đã kiểm duyệt AI'} size="md" />
                ) : (
                  <span className="qv-not-verified">⏳ Chưa được hệ thống AI xác minh</span>
                )}
              </div>

              <div className="qv-quantity-row">
                <span
                  className="qv-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </span>
                <span className="qv-qty-value">{quantity}</span>
                <span className="qv-qty-btn" onClick={() => setQuantity((q) => q + 1)}>+</span>

                <button
                  type="button"
                  className="qv-add-cart-btn"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Đang thêm...' : '🛒 Thêm vào giỏ'}
                </button>
              </div>
            </div>
          </div>

          <div className="qv-reviews-section">
            <h3 className="qv-section-title">Đánh giá &amp; bình luận</h3>

            {reviewsLoading ? (
              <p className="qv-muted">Đang tải đánh giá...</p>
            ) : reviews.length === 0 ? (
              <p className="qv-muted">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm!</p>
            ) : (
              <div className="qv-review-list">
                {reviews.map((review) => (
                  <div key={review.id} className="qv-review-card">
                    <div className="qv-review-header">
                      <div className="qv-review-stars">
                        {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                      </div>
                      <span className="qv-review-author">{review.authorName}</span>
                      <span className="qv-review-date">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="qv-review-comment">{review.comment}</p>

                    {review.sellerReply && (
                      <div className="qv-seller-reply">
                        <strong>Phản hồi từ {storeName}:</strong>
                        <p>{review.sellerReply}</p>
                      </div>
                    )}

                    {isOwner && !review.sellerReply && (
                      <div className="qv-reply-form">
                        <textarea
                          rows={2}
                          placeholder="Phản hồi đánh giá này..."
                          value={replyDrafts[review.id] || ''}
                          onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => handleSubmitReply(review.id)}
                          disabled={submittingReplyId === review.id || !(replyDrafts[review.id] || '').trim()}
                        >
                          {submittingReplyId === review.id ? 'Đang gửi...' : 'Gửi phản hồi'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isOwner && (
              <form className="qv-new-review-form" onSubmit={handleSubmitReview}>
                <h4>Chia sẻ trải nghiệm của bạn</h4>
                <StarPicker
                  value={newReviewRating}
                  hoverValue={hoverRating}
                  onPick={setNewReviewRating}
                  onHover={setHoverRating}
                  onLeave={() => setHoverRating(0)}
                />
                <textarea
                  rows={2}
                  placeholder="Sản phẩm thế nào, bạn có hài lòng không?..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                />
                <button type="submit" disabled={isSubmittingReview}>
                  {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        onDone={() => setToast({ show: false, message: '' })}
      />
    </div>
  );
};

export default ProductQuickView;
