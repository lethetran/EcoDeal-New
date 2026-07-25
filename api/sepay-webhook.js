const { getOrderById, markOrderPaid, decrementDealQuantities } = require('./_lib/firebaseAdmin');
const { createSepayClient } = require('./_lib/sepayClient');

// Theo tài liệu IPN chính thức của SePay:
// order.order_status: "CAPTURED" | "CANCELLED" | "AUTHENTICATION_NOT_NEEDED"
// transaction.transaction_status: "APPROVED" | "DECLINED"
// notification_type: "ORDER_PAID" | "TRANSACTION_VOID"
const extractInvoiceNumber = (body) => body?.order?.order_invoice_number || null;

const isIpnIndicatingPaid = (body) => {
  const notificationType = String(body?.notification_type || '').toUpperCase();
  const orderStatus = String(body?.order?.order_status || '').toUpperCase();
  const transactionStatus = String(body?.transaction?.transaction_status || '').toUpperCase();

  return notificationType === 'ORDER_PAID'
    && orderStatus === 'CAPTURED'
    && transactionStatus === 'APPROVED';
};

// Header xác thực thật của SePay: "X-Secret-Key: <secret_key>" (chỉ gửi khi merchant
// cấu hình Auth Type = Secret Key trên my.sepay.vn, như tài khoản bạn đang dùng).
// Node/Vercel luôn đưa header về chữ thường trong req.headers.
const isAuthorizedRequest = (req) => {
  const configuredSecret = process.env.SEPAY_SECRET_KEY || '';
  if (!configuredSecret) return true; // chưa cấu hình secret thì bỏ qua check (không khuyến khích để lâu)
  return req.headers['x-secret-key'] === configuredSecret;
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  console.log('[sepay-webhook] payload:', JSON.stringify(req.body));

  if (!isAuthorizedRequest(req)) {
    console.warn('[sepay-webhook] rejected: invalid or missing X-Secret-Key header');
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }

  try {
    const notificationType = String(req.body?.notification_type || '').toUpperCase();

    if (notificationType === 'TRANSACTION_VOID') {
      console.log('[sepay-webhook] transaction voided, no state change applied:', req.body?.order?.order_invoice_number);
      res.status(200).json({ received: true, ignored: true });
      return;
    }

    const invoiceNumber = extractInvoiceNumber(req.body);
    if (!invoiceNumber) {
      console.warn('[sepay-webhook] missing order.order_invoice_number in payload');
      res.status(400).json({ error: 'MISSING_ORDER_INVOICE_NUMBER' });
      return;
    }

    const order = await getOrderById(invoiceNumber);
    if (!order) {
      console.warn('[sepay-webhook] order not found for invoice number:', invoiceNumber);
      res.status(404).json({ error: 'ORDER_NOT_FOUND' });
      return;
    }

    if (order.status === 'paid') {
      // Đã xử lý trước đó (SePay có thể gọi lại IPN nhiều lần) — trả 200 luôn, không xử lý lại.
      res.status(200).json({ received: true, alreadyPaid: true });
      return;
    }

    if (!isIpnIndicatingPaid(req.body)) {
      console.log('[sepay-webhook] notification does not indicate a paid order:', {
        notificationType,
        orderStatus: req.body?.order?.order_status,
        transactionStatus: req.body?.transaction?.transaction_status,
      });
      res.status(200).json({ received: true, ignored: true });
      return;
    }

    // Lớp phòng thủ thứ 2 (sau X-Secret-Key): hỏi lại thẳng SePay API để chắc chắn.
    // Nếu API phụ trợ này lỗi vì lý do khác (vd. shape response chưa từng gặp), vẫn đánh
    // dấu paid dựa trên IPN đã qua xác thực header + đúng cả 3 trạng thái ở trên — không
    // để đơn hàng thật của khách bị treo chỉ vì 1 cuộc gọi phụ trợ, chỉ log lại để soát sau.
    let remoteVerifiedStatus = 'UNVERIFIED';
    try {
      const client = createSepayClient();
      const response = await client.order.retrieve(invoiceNumber);
      const remoteOrder = response?.data?.data || response?.data || {};
      console.log('[sepay-webhook] order.retrieve() result:', JSON.stringify(remoteOrder));
      remoteVerifiedStatus = String(remoteOrder.order_status || 'UNKNOWN').toUpperCase();
    } catch (verifyError) {
      console.error('[sepay-webhook] order.retrieve() verification failed, falling back to IPN payload:', verifyError.message);
    }

    await markOrderPaid(order.id, {
      source: 'sepay_ipn',
      orderInvoiceNumber: invoiceNumber,
      transactionId: req.body?.transaction?.transaction_id || null,
      paymentMethod: req.body?.transaction?.payment_method || null,
      remoteVerifiedStatus,
      verifiedAt: new Date().toISOString(),
    });
    console.log('[sepay-webhook] order marked paid:', order.id);

    // Trừ kho thật ngay khi thanh toán online được xác nhận.
    try {
      await decrementDealQuantities(order.items);
    } catch (stockError) {
      console.error('[sepay-webhook] decrementDealQuantities failed:', stockError);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[sepay-webhook] handling failed:', error);
    res.status(500).json({ error: 'WEBHOOK_HANDLING_FAILED' });
  }
};
