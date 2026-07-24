import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { firestore } from '../firebase-config';

const REVIEWS_COLLECTION = 'reviews';

const reviewDocId = (dealId, uid) => `${dealId}_${uid}`;

const mapReview = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    sellerReplyAt: data.sellerReplyAt?.toDate ? data.sellerReplyAt.toDate().toISOString() : data.sellerReplyAt,
  };
};

const sortByNewest = (reviews) =>
  [...reviews].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

export const fetchDealReviews = async (dealId) => {
  const reviewsQuery = query(collection(firestore, REVIEWS_COLLECTION), where('dealId', '==', dealId));
  const snapshot = await getDocs(reviewsQuery);
  return sortByNewest(snapshot.docs.map(mapReview));
};

export const fetchSellerReviews = async (sellerUid) => {
  const reviewsQuery = query(collection(firestore, REVIEWS_COLLECTION), where('sellerUid', '==', sellerUid));
  const snapshot = await getDocs(reviewsQuery);
  return sortByNewest(snapshot.docs.map(mapReview));
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
  const id = reviewDocId(dealId, uid);
  // merge:true để không xoá mất sellerReply (nếu shop đã phản hồi) khi khách sửa lại đánh giá của mình.
  await setDoc(doc(firestore, REVIEWS_COLLECTION, id), {
    dealId,
    sellerUid,
    uid,
    authorName: authorName || 'Ẩn danh',
    rating: Math.max(1, Math.min(5, Number(rating) || 0)),
    comment: String(comment || '').trim().slice(0, 1000),
    createdAt: serverTimestamp(),
  }, { merge: true });
};

export const replyToReview = async (reviewId, replyText) => {
  await setDoc(doc(firestore, REVIEWS_COLLECTION, reviewId), {
    sellerReply: String(replyText || '').trim().slice(0, 1000),
    sellerReplyAt: serverTimestamp(),
  }, { merge: true });
};

export const deleteDealReview = async (dealId, uid) => {
  await deleteDoc(doc(firestore, REVIEWS_COLLECTION, reviewDocId(dealId, uid)));
};
