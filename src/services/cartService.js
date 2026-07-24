import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firestore } from '../firebase-config';

const userCartItemsCollection = (uid) => collection(firestore, 'userCarts', uid, 'items');

const mapCartItem = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  };
};

export const fetchUserCartItems = async (uid) => {
  const cartQuery = query(userCartItemsCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(cartQuery);
  return snapshot.docs.map(mapCartItem);
};

export const addOrIncreaseCartItem = async (uid, item) => {
  const existingQuery = query(
    userCartItemsCollection(uid),
    where('dealId', '==', item.dealId),
    limit(1)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    const existingDoc = existingSnapshot.docs[0];
    const existingData = existingDoc.data();
    const nextQuantity = Math.max(1, Number(existingData.quantity || 1) + Number(item.quantity || 1));

    await updateDoc(doc(firestore, 'userCarts', uid, 'items', existingDoc.id), {
      quantity: nextQuantity,
      updatedAt: serverTimestamp(),
    });

    return {
      id: existingDoc.id,
      ...existingData,
      quantity: nextQuantity,
    };
  }

  const payload = {
    ...item,
    quantity: Math.max(1, Number(item.quantity || 1)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const createdRef = await addDoc(userCartItemsCollection(uid), payload);
  return {
    id: createdRef.id,
    ...item,
    quantity: Math.max(1, Number(item.quantity || 1)),
  };
};

export const updateCartItemQuantity = async (uid, itemId, quantity) => {
  const nextQuantity = Math.max(1, Number(quantity || 1));
  await updateDoc(doc(firestore, 'userCarts', uid, 'items', itemId), {
    quantity: nextQuantity,
    updatedAt: serverTimestamp(),
  });
};

export const removeCartItem = async (uid, itemId) => {
  await deleteDoc(doc(firestore, 'userCarts', uid, 'items', itemId));
};

export const clearUserCart = async (uid) => {
  const snapshot = await getDocs(userCartItemsCollection(uid));
  await Promise.all(snapshot.docs.map((itemDoc) => deleteDoc(itemDoc.ref)));
};

export const createOrderFromCart = async (uid, orderPayload) => {
  const ref = await addDoc(collection(firestore, 'orders'), {
    uid,
    ...orderPayload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};
