const { getOrderById, verifyIdToken, firestore, admin, decrementDealQuantities } = require('./_lib/firebaseAdmin');

// Gọi ngay sau khi tạo đơn COD ở client — trừ kho thật và đánh dấu settledAt
// (mốc để tính thời gian giữ tiền 2 ngày trước khi shop rút được).
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const decoded = await verifyIdToken(idToken);
    if (!decoded) {
      res.status(401).json({ error: 'UNAUTHENTICATED' });
      return;
    }

    const { orderId } = req.body || {};
    if (!orderId) {
      res.status(400).json({ error: 'MISSING_ORDER_ID' });
      return;
    }

    const order = await getOrderById(orderId);
    if (!order) {
      res.status(404).json({ error: 'ORDER_NOT_FOUND' });
      return;
    }
    if (order.uid !== decoded.uid) {
      res.status(403).json({ error: 'FORBIDDEN' });
      return;
    }
    if (order.paymentMethod !== 'cod') {
      res.status(400).json({ error: 'NOT_A_COD_ORDER' });
      return;
    }
    if (order.settledAt) {
      res.status(200).json({ ok: true, alreadySettled: true });
      return;
    }

    await decrementDealQuantities(order.items);
    await firestore.collection('orders').doc(orderId).update({
      settledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('confirm-cod-order failed:', error);
    res.status(500).json({ error: 'CONFIRM_FAILED' });
  }
};
