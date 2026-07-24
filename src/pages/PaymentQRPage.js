// src/pages/PaymentQRPage.js
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import styles from './PaymentQRPage.module.css';
import useCountdown from '../hooks/useCountdown';
import { FaQrcode, FaCopy, FaInfoCircle, FaRedo, FaCheckCircle } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { fetchOrderById, subscribeToOrder } from '../services/cartService';

// Tài khoản nhận tiền — tất cả thanh toán online đều về đây.
const BANK_BIN = '970422'; // Mã Napas của MB Bank (Ngân hàng TMCP Quân đội), đã xác minh qua api.vietqr.io/v2/banks
const BANK_ACCOUNT_NUMBER = '0332811699';
const BANK_ACCOUNT_NAME = ''; // TODO: điền đúng tên chủ tài khoản (in hoa, không dấu) để hiện đẹp trên QR — không bắt buộc để QR hoạt động

// Nội dung chuyển khoản = mã đơn hàng + mã khách (rút gọn) + số tiền, để đối soát thủ công/qua SePay.
// Mã đơn hàng PHẢI xuất hiện nguyên vẹn trong nội dung — đó là khoá để webhook khớp đơn.
const buildTransferContent = (order) => {
  const shortCustomerId = String(order?.uid || '').slice(-6).toUpperCase();
  const amount = Math.round(Number(order?.total || 0));
  return `DH${order.id} KH${shortCustomerId} ${amount}d`;
};

const buildVietQrUrl = (order) => {
  const amount = Math.round(Number(order?.total || 0));
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: buildTransferContent(order),
  });
  if (BANK_ACCOUNT_NAME) params.set('accountName', BANK_ACCOUNT_NAME);
  return `https://api.vietqr.io/image/${BANK_BIN}-${BANK_ACCOUNT_NUMBER}-compact2.png?${params.toString()}`;
};

const PaymentQRPage = () => {
  const location = useLocation();
  const orderIdFromState = location.state?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { minutes, seconds, isExpired, reset } = useCountdown(900);

  useEffect(() => {
    if (!orderIdFromState) {
      setLoading(false);
      setNotFound(true);
      return undefined;
    }

    setLoading(true);
    fetchOrderById(orderIdFromState)
      .then((fetchedOrder) => {
        if (!fetchedOrder) {
          setNotFound(true);
          return;
        }
        setOrder(fetchedOrder);
      })
      .catch((error) => {
        console.error('Cannot load order:', error);
        setNotFound(true);
      })
      .finally(() => setLoading(false));

    // Cloud Function xử lý webhook SePay sẽ cập nhật status của đơn này ngay khi nhận được
    // tiền — realtime listener giúp trang tự chuyển sang "Đã thanh toán" mà không cần tải lại.
    const unsubscribe = subscribeToOrder(orderIdFromState, (liveOrder) => {
      if (liveOrder) setOrder(liveOrder);
    });

    return () => unsubscribe();
  }, [orderIdFromState]);

  const isPaid = order?.status === 'paid';
  const qrCodeUrl = useMemo(() => (order ? buildVietQrUrl(order) : null), [order]);
  const transferContent = useMemo(() => (order ? buildTransferContent(order) : ''), [order]);

  const handleCopy = (text) => navigator.clipboard.writeText(text);

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          <p style={{ textAlign: 'center', padding: '80px 0' }}>Đang tải thông tin thanh toán...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !order) {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h2>Không tìm thấy đơn hàng cần thanh toán</h2>
            <p>Vui lòng quay lại giỏ hàng và đặt lại đơn.</p>
            <Link to="/cart">Quay lại giỏ hàng</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        <div className={styles.backgroundShapes}>
          <motion.div className={`${styles.shape} ${styles.shape1}`} animate={{ y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className={`${styles.shape} ${styles.shape2}`} animate={{ y: [0, 20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
        </div>

        <motion.div
          className={styles.paymentLayout}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* === CỘT TRÁI: THANH TOÁN === */}
          <div className={styles.paymentSection}>
            <div className={styles.header}>
              <FaQrcode />
              <h2>Thanh toán đơn hàng</h2>
            </div>

            <div className={styles.qrDisplayArea}>
              <AnimatePresence mode="wait">
                {isPaid ? (
                  <motion.div
                    key="paid"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '40px 0' }}
                  >
                    <FaCheckCircle style={{ fontSize: 56, color: '#16a34a' }} />
                    <h3 style={{ margin: '16px 0 6px' }}>Thanh toán thành công!</h3>
                    <p>Đơn hàng #{order.id} đã được xác nhận.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className={styles.instruction}>Quét mã bằng <strong>App Ngân hàng bất kỳ</strong> để hoàn tất</p>
                    <div className={`${styles.qrCodeWrapper} ${isExpired ? styles.expired : ''}`}>
                      <img src={qrCodeUrl} alt="Mã QR chuyển khoản" />
                      {isExpired && (
                        <div className={styles.expiredOverlay}>
                          <FaRedo />
                          <span>Mã đã hết hạn</span>
                          <button onClick={() => reset()}>Tạo lại</button>
                        </div>
                      )}
                    </div>
                    {!isExpired && <p className={styles.countdown}>Hết hạn trong: <strong>{minutes}:{seconds}</strong></p>}
                    <p className={styles.instruction} style={{ marginTop: 8, fontSize: 13 }}>
                      💡 Hệ thống tự động xác nhận ngay khi nhận được chuyển khoản, không cần tải lại trang.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className={styles.mainAmount}>{Number(order.total || 0).toLocaleString('vi-VN')}₫</p>
          </div>

          {/* === CỘT PHẢI: TÓM TẮT & THÔNG TIN THÊM === */}
          <div className={styles.summarySection}>
            <h3>Tóm tắt đơn hàng</h3>
            <div className={styles.summaryItem}>
              <span>Mã đơn hàng</span>
              <strong>#{order.id}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Sản phẩm</span>
              <p>{(order.items || []).map((item) => `${item.name} x${item.quantity}`).join(', ') || '—'}</p>
            </div>
            <div className={styles.summaryTotal}>
              <span>Tổng thanh toán</span>
              <strong>{Number(order.total || 0).toLocaleString('vi-VN')}₫</strong>
            </div>

            <div className={styles.manualTransfer}>
              <h4>Chuyển khoản thủ công</h4>
              <div className={styles.infoRow}>
                <span>Ngân hàng</span>
                <strong>MB Bank (Quân đội)</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Số tài khoản</span>
                <div>
                  <strong>{BANK_ACCOUNT_NUMBER}</strong>
                  <button onClick={() => handleCopy(BANK_ACCOUNT_NUMBER)}><FaCopy /></button>
                </div>
              </div>
              <div className={styles.infoRow}>
                <span>Nội dung</span>
                <div>
                  <strong>{transferContent}</strong>
                  <button onClick={() => handleCopy(transferContent)}><FaCopy /></button>
                </div>
              </div>
            </div>

            <div className={styles.supportInfo}>
              <FaInfoCircle />
              <span>Gặp sự cố? <a href="mailto:support@phenifood.vn">Liên hệ hỗ trợ</a></span>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentQRPage;
