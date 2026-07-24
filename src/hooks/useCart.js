import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import {
        addOrIncreaseCartItem,
        clearUserCart,
        fetchUserCartItems,
        removeCartItem,
        updateCartItemQuantity,
} from '../services/cartService';

const GUEST_CART_KEY = 'guestCartItems';
const GUEST_SELECTION_KEY = 'guestSelectedItems';
const FALLBACK_IMAGE = '/placeholders/deal-placeholder.svg';

/**
 * Hook quản lý toàn bộ logic và state của giỏ hàng.
 * Sẵn sàng để tích hợp API trong tương lai.
 */
export const useCart = () => {
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());

    const loadGuestCart = useCallback(() => {
        try {
            const savedCart = localStorage.getItem(GUEST_CART_KEY);
            const savedSelection = localStorage.getItem(GUEST_SELECTION_KEY);
            const parsedCart = savedCart ? JSON.parse(savedCart) : [];
            setCartItems(parsedCart);

            if (savedSelection) {
                setSelectedItems(new Set(JSON.parse(savedSelection)));
            } else {
                setSelectedItems(new Set(parsedCart.map((item) => item.id)));
            }
        } catch {
            setCartItems([]);
            setSelectedItems(new Set());
        }
    }, []);

    const loadUserCart = useCallback(async (uid) => {
        const remoteItems = await fetchUserCartItems(uid);
        setCartItems(remoteItems);
        setSelectedItems(new Set(remoteItems.map((item) => item.id)));
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user?.uid) {
                await loadUserCart(user.uid);
            } else {
                loadGuestCart();
            }
        });

        return () => unsubscribe();
    }, [loadGuestCart, loadUserCart]);

    useEffect(() => {
        if (currentUser) return;
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    }, [cartItems, currentUser]);

    useEffect(() => {
        if (currentUser) return;
        localStorage.setItem(GUEST_SELECTION_KEY, JSON.stringify(Array.from(selectedItems)));
    }, [selectedItems, currentUser]);

    // --- CÁC HÀM XỬ LÝ (ACTIONS) ---
    // Dùng useCallback để tối ưu, tránh việc các hàm bị tạo lại không cần thiết

    const handleSelectItem = useCallback((itemId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) newSet.delete(itemId);
            else newSet.add(itemId);
            return newSet;
        });
    }, []);

    const handleSelectAll = useCallback((isSelect) => {
        if (isSelect) {
            setSelectedItems(new Set(cartItems.map(item => item.id)));
        } else {
            setSelectedItems(new Set());
        }
    }, [cartItems]);

    const handleQuantityChange = useCallback(async (itemId, newQuantity) => {
        const clampedQuantity = Math.max(1, newQuantity);
        setCartItems(current => 
            current.map(item => item.id === itemId ? { ...item, quantity: clampedQuantity } : item)
        );

        if (currentUser?.uid) {
            await updateCartItemQuantity(currentUser.uid, itemId, clampedQuantity);
        }
    }, [currentUser]);

    const handleRemoveItem = useCallback(async (itemId) => {
        setCartItems(current => current.filter(item => item.id !== itemId));
        // Cũng xoá khỏi danh sách được chọn nếu nó đang được chọn
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });

        if (currentUser?.uid) {
            await removeCartItem(currentUser.uid, itemId);
        }
    }, [currentUser]);

    const handleAddDealToCart = useCallback(async (deal, addQuantity = 1) => {
        const discount = Math.max(0, Math.min(100, Number(deal?.dealPercentage || 0)));
        const originalPrice = Math.max(0, Number(deal?.salePrice || 0));
        const finalPrice = Math.round(originalPrice * (1 - discount / 100));
        const quantity = Math.max(1, Number(addQuantity) || 1);

        const cartPayload = {
            dealId: String(deal.id || `${deal.productName}-${deal.timestamp || Date.now()}`),
            name: deal.productName || 'Ưu đãi cộng đồng',
            price: finalPrice,
            originalPrice,
            quantity,
            imageUrl: deal.mainImage || deal.allImages?.[0] || FALLBACK_IMAGE,
            store: {
                id: deal.ownerUid || 'community-store',
                name: deal.ownerDisplayName || deal.ownerEmail || 'Cộng đồng Ecodeal',
                deliveryTime: '25-40 phút',
            },
            source: 'flashDeal',
        };

        if (currentUser?.uid) {
            await addOrIncreaseCartItem(currentUser.uid, cartPayload);
            await loadUserCart(currentUser.uid);
            return;
        }

        setCartItems((current) => {
            const existing = current.find((item) => item.dealId === cartPayload.dealId);
            if (!existing) {
                return [{ ...cartPayload, id: `guest-${Date.now()}` }, ...current];
            }
            return current.map((item) =>
                item.dealId === cartPayload.dealId
                    ? { ...item, quantity: Number(item.quantity || 1) + quantity }
                    : item
            );
        });
    }, [currentUser, loadUserCart]);

    const handleClearCart = useCallback(async () => {
        setCartItems([]);
        setSelectedItems(new Set());
        if (currentUser?.uid) {
            await clearUserCart(currentUser.uid);
        }
    }, [currentUser]);

    const cartItemCount = cartItems.reduce((total, item) => {
        return total + Math.max(0, Number(item?.quantity || 0));
    }, 0);

    // Trả về dữ liệu và các hàm xử lý để Component có thể sử dụng
    return {
        currentUser,
        cartItems,
        cartItemCount,
        selectedItems,
        handlers: {
            handleSelectItem,
            handleSelectAll,
            handleQuantityChange,
            handleRemoveItem,
            handleAddDealToCart,
            handleClearCart,
        },
    };
};