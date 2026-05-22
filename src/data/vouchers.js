// Mô phỏng DB chứa tất cả voucher
export const ALL_VOUCHERS = [
    { id: 'vc01', code: 'GIAM10K', description: 'Giảm 10.000đ cho đơn từ 50.000đ', type: 'FIXED', value: 10000, condition: { minOrderValue: 50000 } },
    { id: 'vc02', code: 'FREESHIP', description: 'Miễn phí vận chuyển (tối đa 15.000đ)', type: 'SHIPPING', value: 15000, condition: { minOrderValue: 100000 } },
    { id: 'vc03', code: 'KHAO5PHANTRAM', description: 'Giảm 5% cho đơn hàng từ 200.000đ', type: 'PERCENTAGE', value: 5, condition: { minOrderValue: 200000 } },
    { id: 'vc04', code: 'TANGKEM', description: 'Voucher không áp dụng', type: 'GIFT', value: 0, condition: { minOrderValue: 9999999 } }
];

// Mô phỏng voucher người dùng đã lưu
export const USER_SAVED_VOUCHER_IDS = ['vc01', 'vc02', 'vc03', 'vc04'];