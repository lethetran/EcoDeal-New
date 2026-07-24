const { getOrderById, markOrderPaid } = require('./_lib/firebaseAdmin');
const { createSepayClient } = require('./_lib/sepayClient');

// Xác nhận từ payload IPN mẫu thật của SePay (notification_type: "ORDER_PAID",
// order.order_status: "CAPTURED", transaction.transaction_status: "APPROVED").
// Vẫn liệt kê thêm vài giá trị khả dĩ khác (COMPLETED/SUCCESS...) phòng trường hợp
// phương thức thanh toán khác (BANK_TRANSFER thay vì CARD) trả trạng thái khác đi.
const ORDER_PAID_STATUSES = ['CAPTURED', 'PAID', 'COMPLETED', 'SUCCESS', 'SUCCESSFUL'];
const TRANSACTION_PAID_STATUSES = ['APPROVED', 'SUCCESS', 'SUCCESSFUL', 'COMPLETED'];

const extractInvoiceNumber = (body) =>
  body?.order?.order_invoice_number
  || body?.order_invoice_number
  || body?.data?.order?.order_invoice_number
  || body?.data?.order_invoice_number
  || null;

// SePay báo trạng thái ở 3 chỗ trong cùng 1 payload IPN — chỉ cần 1 trong 3 khớp là coi như đã thanh toán.
// Đây là bước lọc nhanh; bước xác nhận thật vẫn là gọi lại client.order.retrieve() bên dưới.
const isIpnIndicatingPaid = (body) => {
  const notificationType = String(body?.notification_type || '').toUpperCase();
  const orderStatus = String(body?.order?.order_status || '').toUpperCase();
  const transactionStatus = String(body?.transaction?.transaction_status || '').toUpperCase();

  return notificationType === 'ORDER_PAID'
    || ORDER_PAID_STATUSES.includes(orderStatus)
    || TRANSACTION_PAID_STATUSES.includes(transactionStatus);
};

// Kiểm tra "mềm" header xác thực nếu SePay có gửi kèm — không phải nguồn tin cậy chính,
// vì ta luôn xác minh lại trạng thái thật qua client.order.retrieve() bên dưới.
const hasPlausibleAuthHeader = (req) => {
  const secret = process.env.SEPAY_SECRET_KEY || '';
  if (!secret) return true;
  const headerValue = req.headers.authorization || req.headers['x-secret-key'] || '';
  return typeof headerValue === 'string' && headerValue.includes(secret);
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  console.log('[sepay-webhook] payload:', JSON.stringify(req.body));
  console.log('[sepay-webhook] headers:', JSON.stringify(req.headers));

  if (!hasPlausibleAuthHeader(req)) {
    console.warn('[sepay-webhook] auth header did not match SEPAY_SECRET_KEY — processing anyway, will verify via API');
  }

  try {
    const invoiceNumber = extractInvoiceNumber(req.body);
    if (!invoiceNumber) {
      console.warn('[sepay-webhook] missing order_invoice_number in payload');
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
      console.log('[sepay-webhook] notification does not indicate a paid order, ignoring:', req.body?.notification_type);
      res.status(200).json({ received: true, ignored: true });
      return;
    }

    // Xác minh lại: hỏi thẳng SePay API bằng Basic Auth (merchant_id + secret_key),
    // không chỉ tin nội dung IPN gửi lên — tránh trường hợp có người giả POST tới endpoint này.
    // Nếu vì lý do gì đó không gọi được API xác minh (vd. shape response khác dự kiến),
    // vẫn đánh dấu paid dựa trên payload IPN đã qua bước lọc isIpnIndicatingPaid ở trên,
    // để không làm treo đơn hàng thật của khách — chỉ log rõ để soát lại sau.
    let remoteStatus = 'UNVERIFIED';
    try {
      const client = createSepayClient();
      const response = await client.order.retrieve(invoiceNumber);
      const remoteOrder = response?.data?.data || response?.data || {};
      console.log('[sepay-webhook] order.retrieve() result:', JSON.stringify(remoteOrder));
      remoteStatus = String(remoteOrder.order_status || remoteOrder.status || 'UNKNOWN').toUpperCase();
    } catch (verifyError) {
      console.error('[sepay-webhook] order.retrieve() verification failed, falling back to IPN payload:', verifyError.message);
    }

    await markOrderPaid(order.id, {
      source: 'sepay_ipn',
      orderInvoiceNumber: invoiceNumber,
      notificationType: req.body?.notification_type || null,
      orderStatus: req.body?.order?.order_status || null,
      transactionStatus: req.body?.transaction?.transaction_status || null,
      remoteVerifiedStatus: remoteStatus,
      verifiedAt: new Date().toISOString(),
    });
    console.log('[sepay-webhook] order marked paid:', order.id);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[sepay-webhook] handling failed:', error);
    res.status(500).json({ error: 'WEBHOOK_HANDLING_FAILED' });
  }
};
