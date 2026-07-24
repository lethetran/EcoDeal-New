import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { firestore } from '../firebase-config';

const REVIEWS_COLLECTION = 'reviews';

const mapDoc = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
  };
};

const sortByNewest = (list) =>
  [...list].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

// --- Đánh giá (rating) — mỗi lần "Chia sẻ trải nghiệm" tạo 1 bình luận MỚI, riêng biệt.
// Không upsert theo (dealId, uid) nữa vì khách muốn được viết nhiều lượt, không bị đè. ---

export const fetchDealReviews = async (dealId) => {
  const reviewsQuery = query(collection(firestore, REVIEWS_COLLECTION), where('dealId', '==', dealId));
  const snapshot = await getDocs(reviewsQuery);
  return sortByNewest(snapshot.docs.map(mapDoc));
};

export const fetchSellerReviews = async (sellerUid) => {
  const reviewsQuery = query(collection(firestore, REVIEWS_COLLECTION), where('sellerUid', '==', sellerUid));
  const snapshot = await getDocs(reviewsQuery);
  return sortByNewest(snapshot.docs.map(mapDoc));
};

export const summarizeRatings = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = reviews.reduce((total, r) => total + Number(r.rating || 0), 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
};

export const fetchSellerRatingSummary = async (sellerUid) => {
  const reviews = await fetchSellerReviews(sellerUid);
  return summarizeRatings(reviews);
};

export const submitDealReview = async (dealId, sellerUid, uid, { rating, comment, authorName }) => {
  await addDoc(collection(firestore, REVIEWS_COLLECTION), {
    dealId,
    sellerUid,
    uid,
    authorName: authorName || 'Ẩn danh',
    rating: Math.max(1, Math.min(5, Number(rating) || 0)),
    comment: String(comment || '').trim().slice(0, 1000),
    createdAt: serverTimestamp(),
  });
};

export const deleteDealReview = async (reviewId) => {
  await deleteDoc(doc(firestore, REVIEWS_COLLECTION, reviewId));
};

// --- Bình luận qua lại (thread) dưới mỗi đánh giá — mỗi tin là 1 document riêng,
// KHÔNG bao giờ ghi đè lên tin trước đó. Cả khách (chủ đánh giá) và shop (chủ bài đăng)
// đều có thể nhắn nhiều lượt qua lại trong cùng 1 thread. ---

export const fetchReviewReplies = async (reviewId) => {
  const repliesQuery = query(
    collection(firestore, REVIEWS_COLLECTION, reviewId, 'replies'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(repliesQuery);
  return snapshot.docs.map(mapDoc);
};

export const addReviewReply = async (reviewId, { uid, authorName, isSeller, message }) => {
  await addDoc(collection(firestore, REVIEWS_COLLECTION, reviewId, 'replies'), {
    uid,
    authorName: authorName || 'Ẩn danh',
    isSeller: !!isSeller,
    message: String(message || '').trim().slice(0, 1000),
    createdAt: serverTimestamp(),
  });
};
