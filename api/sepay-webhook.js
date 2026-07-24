const { getOrderById, markOrderPaid } = require('./_lib/firebaseAdmin');
const { createSepayClient } = require('./_lib/sepayClient');

// Các giá trị order_status/transaction_status coi là "đã thanh toán".
// SDK sepay-pg-node không công bố kiểu dữ liệu chính xác cho order.retrieve(),
// nên liệt kê rộng các khả năng — kiểm tra log Vercel sau lần thanh toán thật/sandbox
// đầu tiên để biết chính xác giá trị SePay trả về, rồi rút gọn lại danh sách này.
const PAID_STATUSES = ['PAID', 'SUCCESS', 'SUCCESSFUL', 'COMPLETED', 'COMPLETE'];

const extractInvoiceNumber = (body) =>
  body?.order_invoice_number
  || body?.order?.order_invoice_number
  || body?.data?.order_invoice_number
  || body?.data?.order?.order_invoice_number
  || null;

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

    // Nguồn xác nhận chính: hỏi thẳng SePay API bằng Basic Auth (merchant_id + secret_key),
    // không tin trực tiếp nội dung IPN gửi lên — tránh trường hợp có người giả POST tới endpoint này.
    const client = createSepayClient();
    const response = await client.order.retrieve(invoiceNumber);
    const remoteOrder = response?.data?.data || response?.data || {};
    console.log('[sepay-webhook] order.retrieve() result:', JSON.stringify(remoteOrder));

    const remoteStatus = String(
      remoteOrder.order_status || remoteOrder.status || ''
    ).toUpperCase();

    if (PAID_STATUSES.includes(remoteStatus)) {
      await markOrderPaid(order.id, {
        source: 'sepay_ipn',
        orderInvoiceNumber: invoiceNumber,
        remoteStatus,
        verifiedAt: new Date().toISOString(),
      });
      console.log('[sepay-webhook] order marked paid:', order.id);
    } else {
      console.log('[sepay-webhook] order status not paid yet:', remoteStatus);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[sepay-webhook] handling failed:', error);
    res.status(500).json({ error: 'WEBHOOK_HANDLING_FAILED' });
  }
};
