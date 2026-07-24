const { getOrderById, verifyIdToken } = require('./_lib/firebaseAdmin');
const { createSepayClient } = require('./_lib/sepayClient');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    // Bắt buộc đăng nhập — chặn việc bất kỳ ai tạo phiên thanh toán cho orderId của người khác.
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

    const appUrl = process.env.PUBLIC_APP_URL || `https://${req.headers.host}`;
    const client = createSepayClient();

    const checkoutURL = client.checkout.initCheckoutUrl();
    const checkoutFormfields = client.checkout.initOneTimePaymentFields({
      operation: 'PURCHASE',
      payment_method: 'BANK_TRANSFER',
      order_invoice_number: order.id,
      order_amount: Math.round(Number(order.total) || 0),
      currency: 'VND',
      order_description: `Thanh toan don hang ${order.id}`,
      customer_id: order.uid,
      success_url: `${appUrl}/payment-result?status=success&orderId=${order.id}`,
      error_url: `${appUrl}/payment-result?status=error&orderId=${order.id}`,
      cancel_url: `${appUrl}/payment-result?status=cancel&orderId=${order.id}`,
    });

    res.status(200).json({ checkoutURL, checkoutFormfields });
  } catch (error) {
    console.error('create-checkout failed:', error);
    res.status(500).json({ error: 'CHECKOUT_INIT_FAILED' });
  }
};
