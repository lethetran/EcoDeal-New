import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase-config';

const DEALS_COLLECTION = 'flashDeals';
const DEFAULT_IMAGE_FALLBACK = '/placeholders/deal-placeholder.svg';
const IMAGE_UPLOAD_TIMEOUT_MS = 20000;
const FIRESTORE_TIMEOUT_MS = 15000;

const withTimeout = (promise, timeoutMs, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label || 'REQUEST'}_TIMEOUT`)), timeoutMs)
    ),
  ]);

const sanitizeImage = (imageValue) => {
  if (typeof imageValue !== 'string') return DEFAULT_IMAGE_FALLBACK;
  if (!imageValue) return DEFAULT_IMAGE_FALLBACK;
  return imageValue;
};

const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

const extensionFromDataUrl = (value) => {
  const match = value.match(/^data:image\/(\w+);base64,/i);
  if (!match) return 'png';
  const ext = match[1].toLowerCase();
  return ext === 'jpeg' ? 'jpg' : ext;
};

const uploadImageDataUrl = async (dataUrl, uid, index) => {
  const extension = extensionFromDataUrl(dataUrl);
  const fileName = `${Date.now()}-${index}.${extension}`;
  const imageRef = ref(storage, `deals/${uid}/${fileName}`);
  await withTimeout(uploadString(imageRef, dataUrl, 'data_url'), IMAGE_UPLOAD_TIMEOUT_MS, 'IMAGE_UPLOAD');
  return withTimeout(getDownloadURL(imageRef), IMAGE_UPLOAD_TIMEOUT_MS, 'IMAGE_URL');
};

const resolveImageUrl = async (imageValue, uid, index, cache, uploadErrors) => {
  if (!isDataUrl(imageValue)) {
    return sanitizeImage(imageValue);
  }

  if (cache.has(imageValue)) {
    return cache.get(imageValue);
  }

  try {
    const uploadedUrl = await uploadImageDataUrl(imageValue, uid, index);
    cache.set(imageValue, uploadedUrl);
    return uploadedUrl;
  } catch (error) {
    const reason = error?.code || error?.message || 'UNKNOWN_UPLOAD_ERROR';
    console.error('Image upload failed:', reason, error);
    uploadErrors.push(reason);
    return DEFAULT_IMAGE_FALLBACK;
  }
};

const normalizeDealForStorage = async (dealData = {}, uid) => {
  const uploadCache = new Map();
  const uploadErrors = [];
  const rawImages = Array.isArray(dealData.allImages) ? dealData.allImages.slice(0, 6) : [];
  const normalizedImages = await Promise.all(
    rawImages.map((image, index) => resolveImageUrl(image, uid, index, uploadCache, uploadErrors))
  );

  const mainImage = dealData.mainImage || rawImages[0] || DEFAULT_IMAGE_FALLBACK;
  const normalizedMainImage = await resolveImageUrl(mainImage, uid, 'main', uploadCache, uploadErrors);

  const hasRealImage = [normalizedMainImage, ...normalizedImages].some(
    (img) => typeof img === 'string' && img && img !== DEFAULT_IMAGE_FALLBACK
  );

  if (!hasRealImage) {
    const reason = uploadErrors[0] || 'UNKNOWN_UPLOAD_ERROR';
    throw new Error(`IMAGE_UPLOAD_ALL_FAILED:${reason}`);
  }

  return {
    ...dealData,
    mainImage: normalizedMainImage,
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

  const payload = await normalizeDealForStorage(dealData, user.uid);
  const docRef = await withTimeout(addDoc(collection(firestore, DEALS_COLLECTION), {
    ...payload,
    ownerUid: user.uid,
    ownerEmail: user.email || '',
    ownerDisplayName: user.displayName || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }), FIRESTORE_TIMEOUT_MS, 'SAVE_DEAL');

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
