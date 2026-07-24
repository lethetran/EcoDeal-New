import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './ProductQuickView.css';
import { auth } from '../../firebase-config';
import { useCart } from '../../hooks/useCart';
import {
  addReviewReply,
  fetchDealReviews,
  fetchReviewReplies,
  fetchSellerRatingSummary,
  submitDealReview,
} from '../../services/reviewService';
import { createNotification } from '../../services/notificationService';
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

const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('vi-VN');
};

const displayNameOf = (user) =>
  (user?.displayName || '').trim() || (user?.email || '').split('@')[0] || 'Ẩn danh';

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

const ReplyThread = ({ review, replies, currentUser, deal, storeName, onReplySent }) => {
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canReply = !!currentUser && (currentUser.uid === review.uid || currentUser.uid === deal.ownerUid);
  const isSeller = currentUser?.uid === deal.ownerUid;

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !currentUser) return;

    setSubmitting(true);
    try {
      const authorName = isSeller ? `${storeName} (Shop)` : displayNameOf(currentUser);

      await addReviewReply(review.id, {
        uid: currentUser.uid,
        authorName,
        isSeller,
        message: text,
      });

      const notifyTarget = isSeller ? review.uid : deal.ownerUid;
      if (notifyTarget && notifyTarget !== currentUser.uid) {
        await createNotification({
          uid: notifyTarget,
          fromUid: currentUser.uid,
          type: 'review_reply',
          message: isSeller
            ? `${storeName} đã phản hồi bình luận của bạn về "${deal.productName}"`
            : `${authorName} đã trả lời bình luận trên "${deal.productName}"`,
          dealId: deal.id,
        });
      }

      setDraft('');
      await onReplySent();
    } catch (error) {
      console.error('Cannot submit reply:', error);
      alert('Không thể gửi phản hồi lúc này, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="qv-thread">
      {replies.length > 0 && (
        <div className="qv-thread-list">
          {replies.map((reply) => (
            <div key={reply.id} className={`qv-thread-msg ${reply.isSeller ? 'qv-thread-msg--seller' : ''}`}>
              <div className="qv-thread-msg__head">
                <strong>{reply.authorName}</strong>
                <span>{formatDateTime(reply.createdAt)}</span>
              </div>
              <p>{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      {canReply && (
        <div className="qv-reply-form">
          <textarea
            rows={2}
            placeholder={isSeller ? 'Phản hồi đánh giá này với vai trò shop...' : 'Trả lời shop...'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="button" onClick={handleSend} disabled={submitting || !draft.trim()}>
            {submitting ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      )}
    </div>
  );
};

const ProductQuickView = ({ deal, onClose }) => {
  const { handlers } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [repliesByReview, setRepliesByReview] = useState({});
  const [sellerRating, setSellerRating] = useState({ average: 0, count: 0 });

  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

  const loadReviewsAndReplies = async () => {
    const dealReviews = await fetchDealReviews(deal.id);
    setReviews(dealReviews);

    const repliesEntries = await Promise.all(
      dealReviews.map((review) => fetchReviewReplies(review.id).then((replies) => [review.id, replies]))
    );
    setRepliesByReview(Object.fromEntries(repliesEntries));
  };

  useEffect(() => {
    let cancelled = false;
    setReviewsLoading(true);

    loadReviewsAndReplies()
      .catch((error) => console.error('Cannot load reviews:', error))
      .finally(() => { if (!cancelled) setReviewsLoading(false); });

    fetchSellerRatingSummary(deal.ownerUid)
      .then((summary) => { if (!cancelled) setSellerRating(summary); })
      .catch((error) => console.error('Cannot load seller rating:', error));

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal.id, deal.ownerUid]);

  const refreshReviewReplies = async (reviewId) => {
    const replies = await fetchReviewReplies(reviewId);
    setRepliesByReview((prev) => ({ ...prev, [reviewId]: replies }));
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
      const authorName = displayNameOf(currentUser);

      await submitDealReview(deal.id, deal.ownerUid, currentUser.uid, {
        rating: newReviewRating,
        comment: newReviewText,
        authorName,
      });

      await createNotification({
        uid: deal.ownerUid,
        fromUid: currentUser.uid,
        type: 'new_review',
        message: `${authorName} vừa đánh giá ${newReviewRating}⭐ cho "${deal.productName}"`,
        dealId: deal.id,
      });

      const [, summary] = await Promise.all([
        loadReviewsAndReplies(),
        fetchSellerRatingSummary(deal.ownerUid),
      ]);
      setSellerRating(summary);
      setNewReviewText('');
      setNewReviewRating(5);
    } catch (error) {
      console.error('Cannot submit review:', error);
      alert('Không thể gửi đánh giá lúc này, vui lòng thử lại.');
    } finally {
      setIsSubmittingReview(false);
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

                    <ReplyThread
                      review={review}
                      replies={repliesByReview[review.id] || []}
                      currentUser={currentUser}
                      deal={deal}
                      storeName={storeName}
                      onReplySent={() => refreshReviewReplies(review.id)}
                    />
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
