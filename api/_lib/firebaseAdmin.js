// Dùng chung cho mọi Vercel serverless function trong /api.
// Firebase Admin SDK chạy ở đây (server, không phải trình duyệt) nên có thể
// ghi thẳng vào Firestore bất kể Security Rules — vì vậy các hàm ở đây
// KHÔNG được gọi trực tiếp từ client, chỉ dùng nội bộ trong /api/*.js.
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel lưu biến môi trường dạng 1 dòng nên private key cần thay \\n thành xuống dòng thật.
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = admin.firestore();

const getOrderById = async (orderId) => {
  const snap = await firestore.collection('orders').doc(orderId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
};

const verifyIdToken = async (idToken) => {
  if (!idToken) return null;
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error('verifyIdToken failed:', error);
    return null;
  }
};

const markOrderPaid = async (orderId, paymentMeta) => {
  await firestore.collection('orders').doc(orderId).update({
    status: 'paid',
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
    settledAt: admin.firestore.FieldValue.serverTimestamp(),
    paymentMeta: paymentMeta || null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

// Trừ kho thật khi 1 đơn hàng được xác nhận (COD ngay lúc đặt, online khi webhook báo đã thanh toán).
// Chạy trong 1 transaction để tránh 2 đơn cùng lúc trừ đè lên nhau (race condition).
const decrementDealQuantities = async (items) => {
  const itemsWithDeal = (items || []).filter((item) => item?.dealId);
  if (itemsWithDeal.length === 0) return;

  await firestore.runTransaction(async (tx) => {
    const dealRefs = itemsWithDeal.map((item) => firestore.collection('flashDeals').doc(item.dealId));
    const dealSnaps = await Promise.all(dealRefs.map((ref) => tx.get(ref)));

    dealSnaps.forEach((snap, index) => {
      if (!snap.exists) return;
      const item = itemsWithDeal[index];
      const currentQuantity = Number(snap.data().quantity) || 0;
      const nextQuantity = Math.max(0, currentQuantity - Number(item.quantity || 0));
      tx.update(snap.ref, {
        quantity: nextQuantity,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
  });
};

module.exports = { admin, firestore, getOrderById, verifyIdToken, markOrderPaid, decrementDealQuantities };
