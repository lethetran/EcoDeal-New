import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../firebase-config';

const DEALS_COLLECTION = 'flashDeals';
const DEFAULT_IMAGE_FALLBACK = '/placeholders/deal-placeholder.svg';

const sanitizeImage = (imageValue) => {
  if (typeof imageValue !== 'string') return DEFAULT_IMAGE_FALLBACK;
  if (imageValue.startsWith('data:')) return DEFAULT_IMAGE_FALLBACK;
  return imageValue;
};

const normalizeDealForStorage = (dealData = {}) => {
  const normalizedImages = Array.isArray(dealData.allImages)
    ? dealData.allImages.map(sanitizeImage).slice(0, 6)
    : [];

  return {
    ...dealData,
    mainImage: sanitizeImage(dealData.mainImage),
    allImages: normalizedImages,
  };
};

const mapDealDocument = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    mainImage: sanitizeImage(data.mainImage),
    allImages: Array.isArray(data.allImages) ? data.allImages.map(sanitizeImage) : [],
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  };
};

export const saveDeal = async (dealData) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('AUTH_REQUIRED');
  }

  const payload = normalizeDealForStorage(dealData);
  const docRef = await addDoc(collection(firestore, DEALS_COLLECTION), {
    ...payload,
    ownerUid: user.uid,
    ownerEmail: user.email || '',
    ownerDisplayName: user.displayName || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...payload,
    ownerUid: user.uid,
    ownerEmail: user.email || '',
    ownerDisplayName: user.displayName || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const fetchLatestDeals = async (maxItems = 50) => {
  const dealsQuery = query(
    collection(firestore, DEALS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );

  const snapshot = await getDocs(dealsQuery);
  return snapshot.docs.map(mapDealDocument);
};
