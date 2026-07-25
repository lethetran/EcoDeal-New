import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
// import { Link } from "react-router-dom";
import styles from "./CheckoutPage.module.css";
import AddressModal from "../components/Checkout/AddressModal";
import VoucherModal from "../components/CartPage/VoucherModal";
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer"; // Nếu bạn muốn sử dụng Footer, hãy bỏ comment dòng này
import { auth } from '../firebase-config';
import { useCart } from '../hooks/useCart';
import { createOrderFromCart } from '../services/cartService';
import { fetchUserAddresses, saveUserAddresses } from '../services/userProfileService';
import { ALL_VOUCHERS } from '../data/vouchers';

// Import các icon từ thư viện 'react-icons'
import {
  FiChevronLeft,
  FiMapPin,
  FiShoppingCart,
  FiTruck,
  FiShoppingBag,
  FiCreditCard,
  FiDollarSign,
  FiEdit2,
  FiTag,
  FiX,
  FiEdit3,
} from "react-icons/fi";

const CHECKOUT_ADDRESSES_STORAGE_KEY = 'checkoutAddresses';

const computeVoucherDiscount = (voucher, subTotal, shippingFee) => {
  if (!voucher) return 0;
  switch (voucher.type) {
    case 'PERCENTAGE':
      return Math.round(subTotal * (Number(voucher.value || 0) / 100));
    case 'FIXED':
      return Math.min(Number(voucher.value || 0), subTotal);
    case 'SHIPPING':
      return Math.min(Number(voucher.value || 0), shippingFee);
    default:
      return 0;
  }
};

// --- Component con ---

const Section = ({ icon, title, children, action }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionTitleWrapper}>
        <span className={styles.sectionIcon}>{icon}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {action && <div className={styles.sectionAction}>{action}</div>}
    </div>
    <div className={styles.sectionContent}>{children}</div>
  </div>
);

const RadioCard = ({
  icon,
  name,
  value,
  checked,
  onChange,
  title,
  description,
}) => (
  <label className={styles.radioCard}>
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <div className={styles.radioCardIcon}>{icon}</div>
    <div className={styles.radioCardContent}>
      <span className={styles.radioCardTitle}>{title}</span>
      {description && (
        <span className={styles.radioCardDesc}>{description}</span>
      )}
    </div>
    <div className={styles.radioCardCheckMark}></div>
  </label>
);

const CheckoutPage = () => {
  const { currentUser, cartItems, selectedItems, handlers } = useCart();
  // State
  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderNote, setOrderNote] = useState("");
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [appliedVoucherId, setAppliedVoucherId] = useState(null);
  const [isVoucherModalOpen, setVoucherModalOpen] = useState(false);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);

  useEffect(() => {
    const loadAddresses = async () => {
      if (currentUser?.uid) {
        try {
          const remoteAddresses = await fetchUserAddresses(currentUser.uid);
          setAddresses(remoteAddresses);
          const defaultAddress = remoteAddresses.find((addr) => addr.isDefault) || remoteAddresses[0] || null;
          setShippingAddress(defaultAddress);
          return;
        } catch (error) {
          console.error('Cannot load user addresses:', error);
        }
      }

      try {
        const savedAddresses = JSON.parse(localStorage.getItem(CHECKOUT_ADDRESSES_STORAGE_KEY) || '[]');
        const safeAddresses = Array.isArray(savedAddresses) ? savedAddresses : [];
        setAddresses(safeAddresses);
        const defaultAddress = safeAddresses.find((addr) => addr.isDefault) || safeAddresses[0] || null;
        setShippingAddress(defaultAddress);
      } catch {
        setAddresses([]);
        setShippingAddress(null);
      }
    };

    loadAddresses();
  }, [currentUser]);

  const persistAddresses = useCallback(async (nextAddresses) => {
    setAddresses(nextAddresses);
    const defaultAddress = nextAddresses.find((addr) => addr.isDefault) || nextAddresses[0] || null;
    setShippingAddress(defaultAddress);

    if (currentUser?.uid) {
      await saveUserAddresses(currentUser.uid, nextAddresses);
      return;
    }

    localStorage.setItem(CHECKOUT_ADDRESSES_STORAGE_KEY, JSON.stringify(nextAddresses));
  }, [currentUser]);

  const itemsForCheckout = useMemo(() => {
    const selected = cartItems.filter((item) => selectedItems.has(item.id));
    return selected.length > 0 ? selected : cartItems;
  }, [cartItems, selectedItems]);

  const groupedByStore = useMemo(() => {
    return itemsForCheckout.reduce((acc, item) => {
      const storeId = item.store.id;
      if (!acc[storeId]) {
        acc[storeId] = {
          storeInfo: item.store,
          items: [],
        };
      }
      acc[storeId].items.push(item);
      return acc;
    }, {});
  }, [itemsForCheckout]);

  // Dữ liệu phái sinh
  const subTotal = useMemo(
    () =>
      itemsForCheckout.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [itemsForCheckout]
  );
  const shippingFee = useMemo(
    () => (shippingMethod === "delivery" ? 15000 : 0),
    [shippingMethod]
  );
  const appliedVoucher = useMemo(
    () => ALL_VOUCHERS.find((v) => v.id === appliedVoucherId) || null,
    [appliedVoucherId]
  );
  const discountAmount = useMemo(
    () => computeVoucherDiscount(appliedVoucher, subTotal, shippingFee),
    [appliedVoucher, subTotal, shippingFee]
  );
  const total = Math.max(0, subTotal + shippingFee - discountAmount); // Đảm bảo tổng không âm

  // Hàm xử lý
  const applyVoucherByCode = (code) => {
    const voucher = ALL_VOUCHERS.find(
      (v) => v.code.toUpperCase() === code.toUpperCase()
    );
    if (!voucher) {
      setVoucherError("Mã không hợp lệ.");
      return;
    }
    if (subTotal < voucher.condition.minOrderValue) {
      setVoucherError(
        `Đơn hàng cần tối thiểu ${voucher.condition.minOrderValue.toLocaleString("vi-VN")}đ để dùng mã này.`
      );
      return;
    }
    setAppliedVoucherId(voucher.id);
    setVoucherInput(voucher.code);
    setVoucherError("");
  };

  const handleApplyVoucherInput = () => applyVoucherByCode(voucherInput);

  const handleApplyVoucherFromModal = (voucherId) => {
    const voucher = ALL_VOUCHERS.find((v) => v.id === voucherId);
    if (voucher) applyVoucherByCode(voucher.code);
    setVoucherModalOpen(false);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucherId(null);
    setVoucherInput("");
    setVoucherError("");
  };

  const handlePlaceOrder = async () => {
    if (!auth.currentUser) {
      alert('Bạn cần đăng nhập hoặc đăng ký để đặt hàng.');
      navigate('/login');
      return;
    }

    if (itemsForCheckout.length === 0) {
      alert('Giỏ hàng đang trống, vui lòng thêm sản phẩm trước khi thanh toán.');
      navigate('/home');
      return;
    }

    if (!shippingAddress?.fullAddress || !shippingAddress?.phone) {
      alert('Vui lòng thêm địa chỉ nhận hàng và số điện thoại trước khi đặt hàng.');
      setAddressModalOpen(true);
      return;
    }

    const sellerUids = [...new Set(
      itemsForCheckout.map((item) => item.store?.id).filter(Boolean)
    )];

    const orderPayload = {
      shippingMethod,
      paymentMethod,
      orderNote,
      voucherCode: appliedVoucher?.code || '',
      discountAmount,
      shippingFee,
      subTotal,
      total,
      status: paymentMethod === 'online' ? 'pending_payment' : 'confirmed',
      shippingAddress,
      sellerUids,
      disputed: false,
      items: itemsForCheckout.map((item) => ({
        cartItemId: item.id,
        dealId: item.dealId || '',
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        store: item.store,
      })),
    };

    let orderId = '';
    try {
      orderId = await createOrderFromCart(auth.currentUser.uid, orderPayload);
    } catch (error) {
      console.error('Create order failed:', error);
      alert('Không thể tạo đơn hàng. Vui lòng thử lại.');
      return;
    }

    // Kiểm tra phương thức thanh toán đã chọn
    if (paymentMethod === 'online') {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ orderId }),
        });

        if (!response.ok) {
          throw new Error(`Checkout init failed: ${response.status}`);
        }

        const { checkoutURL, checkoutFormfields } = await response.json();

        // SePay yêu cầu submit form POST thật (không phải fetch) để chuyển hướng sang trang thanh toán của họ.
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = checkoutURL;

        Object.entries(checkoutFormfields || {}).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } catch (error) {
        console.error('Cannot start SePay checkout:', error);
        alert('Không thể khởi tạo thanh toán online lúc này. Vui lòng thử lại hoặc chọn thanh toán khi nhận hàng.');
      }

    } else if (paymentMethod === 'cod') {
      // Trừ kho thật + đánh dấu settledAt (mốc tính thời gian giữ tiền cho shop) ngay khi đặt COD.
      try {
        const idToken = await auth.currentUser.getIdToken();
        await fetch('/api/confirm-cod-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ orderId }),
        });
      } catch (error) {
        console.error('Cannot confirm COD order:', error);
      }

      await handlers.handleClearCart();
      alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');

      // Sau khi đặt hàng thành công, chuyển về trang chủ theo yêu cầu.
      navigate('/home');

    } else {
      // Xử lý các trường hợp khác nếu có
      alert('Vui lòng chọn phương thức thanh toán.');
    }
  };

  const textareaRef = useRef(null);

  // Hàm này sẽ tự động điều chỉnh chiều cao của textarea
  const handleTextareaInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Tạm thời đặt chiều cao về 'auto' để nó có thể co lại nếu người dùng xóa chữ
      textarea.style.height = "auto";
      // Đặt chiều cao mới bằng với chiều cao của nội dung bên trong nó
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  return (
    <>
      <Header />
    <div className={styles.pageBackground}>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <Link to="/cart" className={styles.backToCartLink}>
            <FiChevronLeft />
            <span>Quay lại giỏ hàng</span>
          </Link>
        </div>

        <div className={styles.checkoutLayout}>
          {/* CỘT BÊN TRÁI */}
          <main className={styles.mainContent}>
            <h1 className={styles.mainTitle}>Hoàn tất đơn hàng</h1>

            <Section
              icon={<FiMapPin />}
              title="Thông tin nhận hàng"
              action={
        <button className={styles.changeButton} onClick={() => setAddressModalOpen(true)}>
            <FiEdit2 /> Thay đổi
        </button>
    }
            >
              <div className={styles.addressInfo}>
                {shippingAddress ? (
                  <>
                    <p className={styles.customerName}>
                      {shippingAddress.fullName} / {shippingAddress.phone}
                    </p>
                    <p className={styles.addressText}>
                      {shippingAddress.fullAddress}
                    </p>
                  </>
                ) : (
                  <p className={styles.addressText}>Bạn chưa có địa chỉ nhận hàng. Vui lòng thêm địa chỉ và số điện thoại.</p>
                )}
              </div>
            </Section>

            <Section icon={<FiShoppingCart />} title="Sản phẩm đã chọn">
              {/* Lặp qua từng nhóm cửa hàng */}
              {Object.values(groupedByStore).map(({ storeInfo, items }) => (
                <div key={storeInfo.id} className={styles.storeGroup}>
                  {/* Header của cửa hàng */}
                  <div className={styles.storeHeader}>
                    <div className={styles.storeIdentity}>
                      <FiShoppingBag />
                      <Link
                        to={`/store/${storeInfo.id}`}
                        className={styles.storeNameLink}
                      >
                        {storeInfo.name}
                      </Link>
                    </div>
                    {/* <button className={styles.chatButton}>
                    <FiMessageSquare />
                    <span>Chat ngay</span>
                </button> */}
                  </div>

                  {/* Tiêu đề cho các cột sản phẩm */}
                  <div className={styles.orderItemsHeader}>
                    <span className={styles.productCell}>Sản phẩm</span>
                    <span className={styles.priceCell}>Đơn giá</span>
                    <span className={styles.quantityCell}>Số lượng</span>
                    <span className={styles.totalCell}>Thành tiền</span>
                  </div>

                  {/* Danh sách các sản phẩm trong cửa hàng đó */}
                  <div className={styles.orderItemsList}>
                    {items.map((item) => (
                      // Component OrderItem bây giờ cần phải có thêm thông tin phân loại
                      <div key={item.id} className={styles.orderItem}>
                        <div className={styles.productCell}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className={styles.productImage}
                          />
                          <div className={styles.productInfo}>
                            <p className={styles.productName}>{item.name}</p>
                            {/* Thêm dòng phân loại sản phẩm */}
                            <p className={styles.productVariation}>
                              Loại: Dáng Dài, L
                            </p>
                          </div>
                        </div>
                        <div className={styles.priceCell}>
                          {item.price.toLocaleString("vi-VN")}đ
                        </div>
                        <div className={styles.quantityCell}>
                          {item.quantity}
                        </div>
                        <div className={styles.totalCell}>
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className={styles.notesContainer}>
                <label htmlFor="orderNote" className={styles.notesLabel}>
                  <FiEdit3 /> {/* <-- Thêm icon vào đây */}
                  <span>Lời nhắn cho người bán</span>{" "}
                  {/* Bọc text trong span */}
                </label>

                {/* Textarea đã được nâng cấp */}
                <textarea
                  id="orderNote"
                  ref={textareaRef} // <-- Gán Ref
                  className={styles.notesTextarea}
                  placeholder="Nhập lời nhắn (nếu có)..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  onInput={handleTextareaInput} // <-- Gọi hàm xử lý khi gõ
                  rows={1} // <-- Bắt đầu với 1 hàng duy nhất
                />
              </div>
            </Section>

            <Section icon={<FiTruck />} title="Phương thức vận chuyển">
              <div className={styles.radioGroup}>
                <RadioCard
                  icon={<FiTruck />}
                  name="shipping"
                  value="delivery"
                  title="Giao hàng tận nơi"
                  description={`Phí dự kiến: ${shippingFee.toLocaleString("vi-VN")}đ`}
                  checked={shippingMethod === "delivery"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <RadioCard
                  icon={<FiShoppingBag />}
                  name="shipping"
                  value="pickup"
                  title="Tự đến lấy hàng"
                  description="Miễn phí tại cửa hàng"
                  checked={shippingMethod === "pickup"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
              </div>
            </Section>

            <Section icon={<FiCreditCard />} title="Phương thức thanh toán">
              <div className={styles.radioGroup}>
                <RadioCard
                  icon={<FiDollarSign />}
                  name="payment"
                  value="cod"
                  title="Thanh toán khi nhận hàng (COD)"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <RadioCard
                  icon={<FiCreditCard />}
                  name="payment"
                  value="online"
                  title="Thanh toán Online"
                  description="Qua thẻ ATM, Visa, Ví điện tử"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
            </Section>
          </main>

          {/* CỘT BÊN PHẢI */}
          <aside className={styles.sidebar}>
            <div className={styles.summaryBox}>
              <h3 className={styles.summaryTitle}>Tổng kết đơn hàng</h3>

              {/* Phần Voucher được nâng cấp */}
              <div className={styles.voucherSection}>
                <label className={styles.voucherLabel}>
                  <FiTag /> Khuyến mãi
                </label>
                {appliedVoucher ? (
                  <div className={styles.appliedVoucher}>
                    <span>Mã: {appliedVoucher.code}</span>
                    <button onClick={handleRemoveVoucher}>
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className={styles.voucherInputWrapper}>
                    <input
                      type="text"
                      placeholder="Nhập mã voucher"
                      value={voucherInput}
                      onChange={(e) => {
                        setVoucherInput(e.target.value);
                        if (voucherError) setVoucherError("");
                      }}
                    />
                    <button
                      onClick={handleApplyVoucherInput}
                      disabled={!voucherInput}
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
                {voucherError && (
                  <p className={styles.voucherErrorText}>{voucherError}</p>
                )}
                <button
                  className={styles.selectVoucherButton}
                  onClick={() => setVoucherModalOpen(true)}
                >
                  Chọn hoặc nhập mã
                </button>
              </div>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Tạm tính</span>
                  <span>{subTotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
                </div>
                {appliedVoucher && (
                  <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                    <span>Giảm giá</span>
                    <span>- {discountAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
              </div>

              <hr className={styles.divider} />

              <div className={`${styles.summaryRow} ${styles.grandTotalRow}`}>
                <span>Tổng cộng</span>
                <span className={styles.grandTotalAmount}>
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button
                className={styles.placeOrderButton}
                onClick={handlePlaceOrder}
              >
                Đặt Hàng
              </button>
            </div>
          </aside>
        </div>
      </div>
      <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setAddressModalOpen(false)}
            addresses={addresses}
            onSaveAddresses={persistAddresses}
                onSelectAddress={(selectedAddr) => {
                    // Cập nhật địa chỉ trên trang Checkout
                    setShippingAddress(selectedAddr);
                    // Đóng modal
                    setAddressModalOpen(false);
                }}
            />
      <VoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setVoucherModalOpen(false)}
        savedVouchers={ALL_VOUCHERS}
        onApply={handleApplyVoucherFromModal}
        subTotal={subTotal}
        appliedVoucherId={appliedVoucherId}
      />
    </div>
    <Footer />
    </>
  );
};

export default CheckoutPage;
