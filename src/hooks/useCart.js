import { useState, useEffect, useCallback } from 'react';

// Dữ liệu mẫu, đặt ở đây cho đơn giản.
// TODO SAU NÀY: Dữ liệu này sẽ được lấy từ API.
const initialCartData = [
       // --- King Burger (store_1) ---
    { 
      id: 1, name: 'Burger Bò Đặc Biệt', 
      price: 79000, // Giá mới (giá khuyến mãi)
      originalPrice: 89000, // Thêm giá gốc
      quantity: 1, 
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200', 
      store: { id: 'store_1', name: 'King Burger', deliveryTime: '25-30 phút' } 
    },
    { 
      id: 3, name: 'Khoai tây chiên cỡ lớn', 
      price: 35000, // Không có giá gốc, sẽ hiển thị bình thường
      quantity: 1, 
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-c7be35d03b9b?w=200',
      store: { id: 'store_1', name: 'King Burger', deliveryTime: '25-30 phút' } 
    },
    { // <-- SẢN PHẨM MỚI 1
      id: 5, name: 'Gà Rán Giòn Cay (2 miếng)', quantity: 1, price: 75000, 
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200',
      store: { id: 'store_1', name: 'King Burger', deliveryTime: '25-30 phút' } 
    },
    {
      id: 6, name: 'Combo Gia Đình', 
      price: 249000, // Giá mới
      originalPrice: 299000, // Giá gốc
      quantity: 1, 
      imageUrl: 'https://images.unsplash.com/photo-1626082929543-5bab896371ec?w=200',
      store: { id: 'store_1', name: 'King Burger', deliveryTime: '25-30 phút' } 
    },

    // --- Circle K (store_2) ---
    { 
      id: 2, name: 'Coca Cola', quantity: 2, price: 15000, 
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200', 
      store: { id: 'store_2', name: 'Circle K', deliveryTime: '15-20 phút' } 
    },
    { 
      id: 4, name: 'Trà sữa trân châu', quantity: 1, price: 55000, 
      imageUrl: 'https://images.unsplash.com/photo-1579781403262-4f65a7019a55?w=200',
      store: { id: 'store_2', name: 'Circle K', deliveryTime: '15-20 phút' } 
    },
    { // <-- SẢN PHẨM MỚI 3
      id: 7, name: 'Bánh mì que Pate', quantity: 2, price: 12000, 
      imageUrl: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=200',
      store: { id: 'store_2', name: 'Circle K', deliveryTime: '15-20 phút' } 
    },
    { // <-- SẢN PHẨM MỚI 4
      id: 8, name: 'Nước suối Aquafina', quantity: 1, price: 8000, 
      imageUrl: 'https://images.unsplash.com/photo-1613109526013-354518598145?w=200',
      store: { id: 'store_2', name: 'Circle K', deliveryTime: '15-20 phút' } 
    },
    
    // --- The Coffee House (store_3 - CỬA HÀNG MỚI) ---
    { // <-- SẢN PHẨM MỚI 5
      id: 9, name: 'Cà Phê Sữa Đá', quantity: 1, price: 39000, 
      imageUrl: 'https://images.unsplash.com/photo-1566385365513-316a3e21843c?w=200',
      store: { id: 'store_3', name: 'The Coffee House', deliveryTime: '20-25 phút' } 
    },
    { // <-- SẢN PHẨM MỚI 6
      id: 10, name: 'Bánh Tiramisu', quantity: 1, price: 45000, 
      imageUrl: 'https://images.unsplash.com/photo-1571987559441-104c5549b0a7?w=200',
      store: { id: 'store_3', name: 'The Coffee House', deliveryTime: '20-25 phút' } 
    },
];

/**
 * Hook quản lý toàn bộ logic và state của giỏ hàng.
 * Sẵn sàng để tích hợp API trong tương lai.
 */
export const useCart = () => {
    // State chứa danh sách sản phẩm trong giỏ
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cartItems');
            // Nếu có dữ liệu trong localStorage thì dùng, không thì dùng dữ liệu mẫu
            return savedCart ? JSON.parse(savedCart) : initialCartData;
        } catch {
            return initialCartData;
        }
    });

    // State chứa ID các sản phẩm được người dùng tích chọn
    const [selectedItems, setSelectedItems] = useState(() => {
        try {
            const savedSelection = localStorage.getItem('selectedItems');
            // Nếu có thì dùng, không thì mặc định chọn tất cả
            return savedSelection ? new Set(JSON.parse(savedSelection)) : new Set(cartItems.map(item => item.id));
        } catch {
            return new Set(cartItems.map(item => item.id));
        }
    });

    // Tự động lưu vào localStorage mỗi khi giỏ hàng thay đổi
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Tự động lưu các mục đã chọn
    useEffect(() => {
        localStorage.setItem('selectedItems', JSON.stringify(Array.from(selectedItems)));
    }, [selectedItems]);

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

    const handleQuantityChange = useCallback((itemId, newQuantity) => {
        const clampedQuantity = Math.max(1, newQuantity);
        setCartItems(current => 
            current.map(item => item.id === itemId ? { ...item, quantity: clampedQuantity } : item)
        );
        // TODO SAU NÀY: Thêm lệnh gọi API để cập nhật số lượng trên server ở đây
        // await api.updateCartItem(itemId, clampedQuantity);
    }, []);

    const handleRemoveItem = useCallback((itemId) => {
        setCartItems(current => current.filter(item => item.id !== itemId));
        // Cũng xoá khỏi danh sách được chọn nếu nó đang được chọn
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });
        // TODO SAU NÀY: Thêm lệnh gọi API để xoá sản phẩm trên server ở đây
        // await api.removeCartItem(itemId);
    }, []);

    // Trả về dữ liệu và các hàm xử lý để Component có thể sử dụng
    return {
        cartItems,
        selectedItems,
        handlers: {
            handleSelectItem,
            handleSelectAll,
            handleQuantityChange,
            handleRemoveItem,
        },
    };
};