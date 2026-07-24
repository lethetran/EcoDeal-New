import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './CartPage.module.css';
import { useCart } from '../hooks/useCart'; // <-- Bước 1: Import hook

// Import các component giao diện (chỉ để hiển thị)
import Header from '../components/Header/Header';
import StoreHeader from '../components/CartPage/StoreHeader';
import CartItem from '../components/CartPage/CartItem';
import OrderSummary from '../components/CartPage/OrderSummary';
import YouMightLike from '../components/CartPage/YouMightLike';
import ConfirmationModal from '../components/CartPage/ConfirmationModal';
import Footer from '../components/Footer/Footer';

const CartPage = () => {
    // Bước 2: Lấy tất cả state và logic từ hook. Component này không cần biết logic bên trong là gì.
    const { cartItems, selectedItems, handlers } = useCart();
    
    // State của riêng component này: dùng để điều khiển việc đóng/mở modal
    const [itemToDelete, setItemToDelete] = useState(null);

    // --- DỮ LIỆU PHÁI SINH (DERIVED STATE) ---
    // Tính toán dữ liệu cần thiết cho việc hiển thị từ state gốc
    const groupedCart = useMemo(() =>
        cartItems.reduce((acc, item) => {
            const storeId = item.store.id;
            if (!acc[storeId]) { acc[storeId] = { storeInfo: item.store, items: [] }; }
            acc[storeId].items.push(item);
            return acc;
        }, {}),
    [cartItems]);

    const selectedProducts = useMemo(() => cartItems.filter(item => selectedItems.has(item.id)), [cartItems, selectedItems]);
    const subTotal = useMemo(() => selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0), [selectedProducts]);
    const shippingFee = subTotal > 0 ? 15000 : 0;
    const total = subTotal + shippingFee;
    const isAllSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;

    // --- HÀM XỬ LÝ CỦA RIÊNG COMPONENT ---
    const promptToRemoveItem = (itemId) => setItemToDelete(itemId);

    const handleConfirmRemove = () => {
        if (!itemToDelete) return;
        handlers.handleRemoveItem(itemToDelete); // Gọi hàm xử lý từ hook
        setItemToDelete(null); // Đóng modal
    };

    // Bước 3: Render giao diện. Cực kỳ rõ ràng và mạch lạc.
    return (
        <>
        <Header />
        <div className={styles.pageContainer}>
            {/* <PageHeader title="Giỏ hàng của bạn" subtitle={`Có ${cartItems.length} sản phẩm trong giỏ hàng`} /> */}

            {cartItems.length > 0 ? (
                <>
                    <div className={styles.cartLayout}>
                        <main className={styles.cartItemsSection}>
                            <header className={styles.cartHeader}>
                                <div className={styles.selectAllWrapper}>
                                    <input type="checkbox" id="selectAll" className={styles.checkbox} checked={isAllSelected} onChange={(e) => handlers.handleSelectAll(e.target.checked)} />
                                    <label htmlFor="selectAll">Chọn tất cả ({cartItems.length} sản phẩm)</label>
                                </div>
                                <Link to="/" className={styles.continueShopping}>Tiếp tục mua sắm</Link>
                            </header>
                            
                            {Object.values(groupedCart).map(({ storeInfo, items }) => (
                                <div key={storeInfo.id} className={styles.storeGroup}>
                                    <StoreHeader store={storeInfo} />
                                    <div className={styles.itemsInStore}>
                                        {items.map(item => (
                                            <CartItem key={item.id} item={item} isSelected={selectedItems.has(item.id)}
                                                onSelect={handlers.handleSelectItem}
                                                onQuantityChange={handlers.handleQuantityChange}
                                                onRemove={promptToRemoveItem}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </main>

                        <aside className={styles.summarySidebar}>
                            <OrderSummary {...{ selectedItems: selectedProducts, subTotal, shippingFee, total }} />
                        </aside>
                    </div>
                    <YouMightLike />
                </>
            ) : (
                <div className={styles.emptyCart}>
                    <img src="/placeholders/deal-placeholder.svg" alt="Giỏ hàng trống" className={styles.emptyCartImage} />
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <p>Hãy thêm vài món ngon vào giỏ hàng nhé!</p>
                    <Link to="/" className={styles.continueShoppingButton}>Quay lại trang chủ</Link>
                </div>
            )}

            <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmRemove} title="Xác nhận xoá sản phẩm"
                message="Bạn có chắc chắn muốn loại bỏ sản phẩm này khỏi giỏ hàng?"
            />
        </div>
        <Footer />
        </>
    );
};

export default CartPage;