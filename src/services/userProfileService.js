import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase-config';

const userProfileDoc = (uid) => doc(firestore, 'userProfiles', uid);

export const fetchUserAddresses = async (uid) => {
  const snap = await getDoc(userProfileDoc(uid));
  if (!snap.exists()) return [];
  const data = snap.data();
  return Array.isArray(data?.addresses) ? data.addresses : [];
};

export const saveUserAddresses = async (uid, addresses) => {
  await setDoc(
    userProfileDoc(uid),
    {
      addresses,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
