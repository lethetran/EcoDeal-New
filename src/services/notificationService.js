import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../firebase-config';

const NOTIFICATIONS_COLLECTION = 'notifications';

const mapNotification = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
  };
};

export const createNotification = async ({ uid, fromUid, type, message, dealId }) => {
  if (!uid || !fromUid || uid === fromUid) return;

  await addDoc(collection(firestore, NOTIFICATIONS_COLLECTION), {
    uid,
    fromUid,
    type: type || 'general',
    message: String(message || '').slice(0, 500),
    dealId: dealId || '',
    read: false,
    createdAt: serverTimestamp(),
  });
};

export const fetchMyNotifications = async (uid, maxItems = 30) => {
  const notificationsQuery = query(collection(firestore, NOTIFICATIONS_COLLECTION), where('uid', '==', uid));
  const snapshot = await getDocs(notificationsQuery);
  return snapshot.docs
    .map(mapNotification)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, maxItems);
};

export const markNotificationRead = async (notificationId) => {
  await updateDoc(doc(firestore, NOTIFICATIONS_COLLECTION, notificationId), { read: true });
};
