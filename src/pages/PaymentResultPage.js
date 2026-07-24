import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { fetchOrderById, subscribeToOrder } from '../services/cartService';

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  // status trên URL chỉ là gợi ý hiển thị tạm thời từ redirect — nguồn xác nhận thật
  // là order.status trên Firestore, do webhook IPN (đã xác minh lại với SePay) cập nhật.
  const redirectStatus = searchParams.get('status');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return undefined;
    }

    fetchOrderById(orderId)
      .then(setOrder)
      .catch((error) => console.error('Cannot load order:', error))
      .finally(() => setLoading(false));

    const unsubscribe = subscribeToOrder(orderId, (liveOrder) => {
      if (liveOrder) setOrder(liveOrder);
    });

    return () => unsubscribe();
  }, [orderId]);

  const isPaid = order?.status === 'paid';

  let content;
  if (loading) {
    content = <p>Đang kiểm tra kết quả thanh toán...</p>;
  } else if (isPaid) {
    content = (
      <>
        <FaCheckCircle style={{ fontSize: 56, color: '#16a34a' }} />
        <h2 style={{ margin: '16px 0 8px' }}>Thanh toán thành công!</h2>
        <p>Đơn hàng #{orderId} đã được xác nhận.</p>
      </>
    );
  } else if (redirectStatus === 'cancel') {
    content = (
      <>
        <FaTimesCircle style={{ fontSize: 56, color: '#9ca3af' }} />
        <h2 style={{ margin: '16px 0 8px' }}>Bạn đã huỷ thanh toán</h2>
        <p>Đơn hàng #{orderId} vẫn đang chờ thanh toán, bạn có thể thử lại.</p>
      </>
    );
  } else if (redirectStatus === 'error') {
    content = (
      <>
        <FaTimesCircle style={{ fontSize: 56, color: '#e11d48' }} />
        <h2 style={{ margin: '16px 0 8px' }}>Thanh toán thất bại</h2>
        <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
      </>
    );
  } else {
    content = (
      <>
        <FaClock style={{ fontSize: 56, color: '#f59e0b' }} />
        <h2 style={{ margin: '16px 0 8px' }}>Đang chờ xác nhận thanh toán</h2>
        <p>Hệ thống sẽ tự động cập nhật ngay khi nhận được tiền, không cần tải lại trang.</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        {content}
        <div style={{ marginTop: 24, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/profile/orders">Xem đơn hàng của tôi</Link>
          <Link to="/home">Về trang chủ</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentResultPage;
