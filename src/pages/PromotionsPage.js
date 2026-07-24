// // src/pages/PromotionsPage/PromotionsPage.jsx

// import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import styles from './PromotionsPage.module.css';
// // import PageHeader from '../components/Home/Header';
// import VoucherDetailModal from '../components/PromotionsPage/VoucherDetailModal';
// import Voucher from '../components/PromotionsPage/Voucher';
// import PromotionBanner from '../components/PromotionsPage/PromotionBanner';
// import { FaTag, FaStore, FaUtensils, FaCheckCircle, FaChevronDown } from 'react-icons/fa';

// // Dữ liệu mẫu (Thay bằng API trong thực tế)
// const allVouchers = [
//   // --- Voucher Sản phẩm ---
//   { type: 'product', code: 'BURGER10K', title: 'Giảm 10K Burger Bò', desc: 'Áp dụng cho Burger Bò Đặc Biệt.', expiry: '30/06/2025', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', saved: true, terms: 'Áp dụng cho tất cả chi nhánh. Không áp dụng đồng thời với các khuyến mãi khác.' },
//   { type: 'product', code: 'PIZZA50K', title: 'Giảm 50K Pizza Hải Sản', desc: 'Áp dụng cho Pizza cỡ lớn.', expiry: '25/07/2025', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', saved: false, terms: 'Áp dụng cho 100 khách hàng đầu tiên trong ngày.' },
//   { type: 'product', code: 'FREECOKE', title: 'Tặng 1 Coca-Cola', desc: 'Khi mua combo bất kỳ.', expiry: '10/08/2025', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', saved: false, terms: 'Áp dụng khi mua trực tiếp tại cửa hàng.' },
//   { type: 'product', code: 'BOGOFSUSHI', title: 'Mua 1 Tặng 1 Sushi', desc: 'Áp dụng cho set Sushi California.', expiry: '05/09/2025', imageUrl: '/placeholders/deal-placeholder.svg', saved: true, terms: 'Chỉ áp dụng vào thứ 3 hàng tuần.' },
//   { type: 'product', code: 'KEM20', title: 'Giảm 20% các loại kem', desc: 'Không giới hạn số lượng.', expiry: '31/08/2025', imageUrl: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400', saved: false, terms: 'Áp dụng cho kem ốc quế và kem ly.' },
//   { type: 'product', code: 'MIENPHIKHOAI', title: 'Tặng Khoai Tây Chiên', desc: 'Cho đơn hàng từ 99K.', expiry: '15/07/2025', imageUrl: '/placeholders/deal-placeholder.svg', saved: false, terms: 'Số lượng có hạn.' },
//   { type: 'product', code: 'SALAD15', title: 'Giảm 15% Salad Healthy', desc: 'Cho lối sống lành mạnh.', expiry: '31/12/2025', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', saved: false, terms: 'Áp dụng cho Salad Ức Gà và Salad Cá Hồi.' },
//   { type: 'product', code: 'COMBO99', title: 'Combo 99K 1 người', desc: 'Bao gồm 1 Gà Rán, 1 Khoai Tây, 1 Nước.', expiry: '30/09/2025', imageUrl: '/placeholders/deal-placeholder.svg', saved: true, terms: 'Chỉ áp dụng tại các cửa hàng ECODEAL.' },
//   { type: 'product', code: 'BANHMI20K', title: 'Đồng giá 20K Bánh Mì', desc: 'Áp dụng cho Bánh Mì Thịt Nướng.', expiry: '01/07/2025', imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400', saved: false, terms: 'Áp dụng từ 6h-9h sáng.' },
//   { type: 'product', code: 'STEAK100', title: 'Giảm 100K Steak Bò Mỹ', desc: 'Cho đơn hàng 2 người.', expiry: '20/07/2025', imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400', saved: false, terms: 'Yêu cầu đặt bàn trước.' },
//   // --- Voucher Cửa hàng ---
//   { type: 'store', code: 'STARBUCKS20', title: 'Giảm 20% Starbucks', desc: 'Cho đơn từ 150K tại mọi chi nhánh.', expiry: '15/07/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: false, terms: 'Chỉ áp dụng khi thanh toán bằng ví điện tử liên kết.' },
//   { type: 'store', code: 'KFC15', title: 'Giảm 15% Gà Rán KFC', desc: 'Cho combo 2 người trở lên.', expiry: '31/07/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: true, terms: 'Không áp dụng cho các ngày lễ, Tết.' },
//   { type: 'store', code: 'HIGHLANDS30', title: 'Giảm 30K Highlands', desc: 'Áp dụng cho đơn từ 100K.', expiry: '31/08/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: false, terms: 'Không áp dụng cho sản phẩm đóng chai.' },
//   { type: 'store', code: 'PHUCLONG10', title: 'Giảm 10% Phúc Long', desc: 'Áp dụng cho toàn bộ menu nước.', expiry: '20/09/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: true, terms: 'Yêu cầu xuất trình thẻ thành viên.' },
//   { type: 'store', code: 'DOMINO40', title: 'Giảm 40% Domino Pizza', desc: 'Áp dụng cho Pizza thứ 2.', expiry: '10/10/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: false, terms: 'Áp dụng khi mua mang về hoặc giao hàng.' },
//   { type: 'store', code: 'MCDONALDSFREE', title: 'Miễn phí vận chuyển', desc: 'Từ McDonald\'s cho đơn từ 120K.', expiry: '01/08/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: false, terms: 'Áp dụng trong bán kính 5km.' },
//   { type: 'store', code: 'THECOFFEEHOUSE25', title: 'Giảm 25K The Coffee House', desc: 'Cho các loại Cà Phê Đá Xay.', expiry: '15/09/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: false, terms: 'Không áp dụng cho topping.' },
//   { type: 'store', code: 'GOGIHOUSE100', title: 'Đi 4 Tính tiền 3 Gogi', desc: 'Áp dụng cho buffet Xèo Xèo.', expiry: '31/12/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: true, terms: 'Áp dụng từ thứ 2 đến thứ 6.' },
//   { type: 'store', code: 'KINGBBQ5', title: 'Giảm 5% King BBQ', desc: 'Trên tổng hóa đơn.', expiry: '30/11/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: false, terms: 'Yêu cầu có thẻ thành viên Redsun.' },
//   { type: 'store', code: 'PASSION25', title: 'Giảm 25% Passion Tea', desc: 'Cho dòng Trà Sữa Trân Châu.', expiry: '18/08/2025', logoUrl: '/placeholders/deal-placeholder.svg', saved: false, terms: 'Chỉ áp dụng tại các chi nhánh được liệt kê.' }
// ];

// const filterTabs = [
//     { id: 'all', name: 'Tất cả', icon: <FaTag /> },
//     { id: 'product', name: 'Món ăn', icon: <FaUtensils /> },
//     { id: 'store', name: 'Cửa hàng', icon: <FaStore /> },
// ];

// const ITEMS_PER_PAGE = 4; // Số voucher hiển thị mỗi lần tải

// const PromotionsPage = () => {
//     const [activeFilter, setActiveFilter] = useState('all');
//     const [selectedVoucher, setSelectedVoucher] = useState(null);
//     const [vouchers, setVouchers] = useState(allVouchers);
//     const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    
//     // Ref để truy cập vào DOM của slider
//     const voucherGridRef = useRef(null);

//     // Hiệu ứng tự động cuộn
//     useEffect(() => {
//         if (visibleCount > ITEMS_PER_PAGE) {
//             const slider = voucherGridRef.current;
//             if (slider) {
//                 const firstNewItemIndex = visibleCount - ITEMS_PER_PAGE;
//                 const newItemElement = slider.children[firstNewItemIndex];
//                 if (newItemElement) {
//                     const scrollLeftPosition = newItemElement.offsetLeft;
//                     slider.scrollTo({ left: scrollLeftPosition, behavior: 'smooth' });
//                 }
//             }
//         }
//     }, [visibleCount]);

//     // Logic lọc và hiển thị voucher
//     const filteredVouchers = useMemo(() => {
//         return vouchers
//             .filter(v => (activeFilter === 'all' ? true : v.type === activeFilter));
//     }, [activeFilter, vouchers]);

//     const visibleVouchers = useMemo(() => {
//         return filteredVouchers.slice(0, visibleCount);
//     }, [filteredVouchers, visibleCount]);

//     const handleLoadMore = () => {
//         setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
//     };

//     // Logic lưu voucher
//     const handleSaveVoucher = useCallback((voucherCode) => {
//         setVouchers(currentVouchers => 
//             currentVouchers.map(v => 
//                 v.code === voucherCode ? { ...v, saved: true } : v
//             )
//         );
//         setSelectedVoucher(prev => prev && prev.code === voucherCode ? { ...prev, saved: true } : prev);
//     }, []);

//     // Reset visibleCount khi filter thay đổi
//     useEffect(() => {
//         setVisibleCount(ITEMS_PER_PAGE);
//         // Cuộn về đầu khi đổi filter
//         if (voucherGridRef.current) {
//             voucherGridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
//         }
//     }, [activeFilter]);

//     return (
//       <>
//       <PromotionBanner />

//         <div className={styles.pageContainer}>
//             {/* <PageHeader
//                 title="Khám phá Ưu đãi"
//                 subtitle="Săn voucher món ngon, rinh deal hời từ các cửa hàng yêu thích!"
//             /> */}

//             <div className={styles.toolbar}>
//                 <div className={styles.filterTabs}>
//                     {filterTabs.map(tab => (
//                         <button
//                             key={tab.id}
//                             className={`${styles.tabButton} ${activeFilter === tab.id ? styles.active : ''}`}
//                             onClick={() => setActiveFilter(tab.id)}
//                         >
//                             {tab.icon}
//                             <span>{tab.name}</span>
//                             {activeFilter === tab.id && (
//                                 <motion.div
//                                     className={styles.activeTabIndicator}
//                                     layoutId="activeTabIndicator"
//                                 />
//                             )}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Nút "Xem thêm" */}
//             <div className={styles.loadMoreContainer}>
//                   <h2 className="foryou-title">Dành cho bạn</h2>
//             {visibleCount < filteredVouchers.length && (
          
//                     <button onClick={handleLoadMore} className={styles.loadMoreButton}>
//                         <span>Xem thêm</span>
//                     </button>
//             )}
//             </div>

//             <motion.div 
//                 layout 
//                 className={styles.voucherGrid} 
//                 ref={voucherGridRef}
//             >
//                 <AnimatePresence>
//                     {visibleVouchers.map(v => (
//                         <motion.div
//                             key={v.code} 
//                             layout
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.8 }}
//                             transition={{ type: 'spring', stiffness: 200, damping: 25 }}
//                             className={styles.voucherCardWrapper}
//                             onClick={() => setSelectedVoucher(v)}
//                         >
//                             <div className={`${styles.voucherCard} ${v.saved ? styles.saved : ''}`}>
//                                 <div className={styles.voucherMedia}>
//                                     <img src={v.type === 'product' ? v.imageUrl : v.logoUrl} alt={v.title} />
//                                     <div className={styles.mediaOverlay}></div>
//                                 </div>
//                                 <div className={styles.voucherContent}>
//                                     <div className={styles.voucherInfo}>
//                                         <h3 className={styles.voucherTitle}>{v.title}</h3>
//                                         <p className={styles.voucherDesc}>{v.desc}</p>
//                                     </div>
//                                     <div className={styles.voucherFooter}>
//                                         <p className={styles.voucherExpiry}>HSD: {v.expiry}</p>
//                                         {v.saved && (
//                                             <div className={styles.savedBadge}>
//                                                 <FaCheckCircle />
//                                                 <span>Đã lưu</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     ))}
//                 </AnimatePresence>
//             </motion.div>

//             <AnimatePresence>
//                 {selectedVoucher && (
//                     <VoucherDetailModal
//                         voucher={selectedVoucher}
//                         onClose={() => setSelectedVoucher(null)}
//                         onSave={handleSaveVoucher}
//                     />
//                 )}
//             </AnimatePresence>
//         </div>
      
//       <Voucher/>  
//       </>
//     );
// };

// export default PromotionsPage;


import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PromotionsPage.module.css';
import PromotionBanner from '../components/PromotionsPage/PromotionBanner';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
// import Header from '../components/Home/Header';
// import Footer from '../components/Introduce/Footer';

// === CÀI ĐẶT HIỂN THỊ CHO TÍNH NĂNG "XEM THÊM" ===
const ITEMS_PER_ROW = 3; 
const INITIAL_ROW_COUNT = 3; 
const ROWS_PER_LOAD = 2;     

const INITIAL_VOUCHER_COUNT = ITEMS_PER_ROW * INITIAL_ROW_COUNT; // = 9
const VOUCHERS_PER_LOAD = ITEMS_PER_ROW * ROWS_PER_LOAD;         // = 6

const initialVouchers = [
  // Dữ liệu voucher của bạn... (Giữ nguyên)
  { type: 'exclusive', code: 'UNIQLO_300K', brandName: 'Uniqlo', brandLogo: 'https://placehold.co/100x100/E6002D/white?text=UQ', value: 'Giảm 300,000đ', condition: 'Cho đơn hàng thời trang từ 2,000,000đ', totalQuantity: 100, remainingQuantity: 80, expiryDate: '2026-08-31T23:59:59'},
  { type: 'exclusive', code: 'TIKI_500K', brandName: 'Tiki Trading', brandLogo: 'https://placehold.co/100x100/1A94FF/white?text=Tiki', value: 'Giảm 500,000đ', condition: 'Áp dụng cho đơn hàng điện tử từ 5,000,000đ', totalQuantity: 50, remainingQuantity: 15, expiryDate: '2026-09-15T23:59:59'},
  { type: 'exclusive', code: 'FAHASA_150K', brandName: 'Fahasa', brandLogo: 'https://placehold.co/100x100/C92127/white?text=FS', value: 'Giảm 150,000đ', condition: 'Cho đơn hàng sách từ 500K', totalQuantity: 200, remainingQuantity: 150, expiryDate: '2026-10-30T23:59:59'},
  { type: 'exclusive', code: 'CGV_BOGO', brandName: 'CGV Cinemas', brandLogo: 'https://placehold.co/100x100/D81F26/white?text=CGV', value: 'Mua 1 Tặng 1', condition: 'Vé xem phim 2D các ngày trong tuần', totalQuantity: 150, remainingQuantity: 40, expiryDate: '2026-11-15T23:59:59'},
  { type: 'exclusive', code: 'THEBODYSHOP_25', brandName: 'The Body Shop', brandLogo: 'https://placehold.co/100x100/004236/white?text=TBS', value: 'Giảm 25%', condition: 'Cho toàn bộ sản phẩm chăm sóc cơ thể', totalQuantity: 100, remainingQuantity: 90, expiryDate: '2026-09-29T23:59:59'},
  { type: 'exclusive', code: 'ADIDAS_1M', brandName: 'Adidas Vietnam', brandLogo: 'https://placehold.co/100x100/000000/white?text=ADS', value: 'Giảm 1,000,000đ', condition: 'Cho đơn hàng giày dép từ 3.5M', totalQuantity: 30, remainingQuantity: 12, expiryDate: '2026-12-26T23:59:59'},
  { type: 'exclusive', code: 'LOCKNLOCK_400K', brandName: 'LocknLock', brandLogo: 'https://placehold.co/100x100/F15A29/white?text=LNL', value: 'Giảm 400,000đ', condition: 'Cho hàng gia dụng từ 1.5M', totalQuantity: 80, remainingQuantity: 75, expiryDate: '2026-11-30T23:59:59'},
  { type: 'exclusive', code: 'TOPZONE_2M', brandName: 'TopZone', brandLogo: 'https://placehold.co/100x100/101010/white?text=TZ', value: 'Giảm 2,000,000đ', condition: 'Khi mua iPhone 17 Series', totalQuantity: 20, remainingQuantity: 5, expiryDate: '2026-08-15T23:59:59'},
  { type: 'exclusive', code: 'WATSONS_100K', brandName: 'Watsons', brandLogo: 'https://placehold.co/100x100/009C9F/white?text=WS', value: 'Giảm 100,000đ', condition: 'Cho đơn mỹ phẩm từ 700K', totalQuantity: 250, remainingQuantity: 220, expiryDate: '2026-10-15T23:59:59'},
  { type: 'exclusive', code: 'STARBUCKS_FREEUP', brandName: 'Starbucks', brandLogo: 'https://placehold.co/100x100/036635/white?text=SB', value: 'Miễn phí Upsize', condition: 'Cho dòng Frappuccino', totalQuantity: 300, remainingQuantity: 180, expiryDate: '2026-09-30T23:59:59'},
  { type: 'hot', code: 'GIAM5PHANTRAM', brandName: 'ECODEAL', brandLogo: 'https://placehold.co/100x100/D93F3F/white?text=PF', value: 'GIẢM 5%', condition: 'Đơn hàng ORDER từ 0đ', totalQuantity: 500, remainingQuantity: 381, expiryDate: '2026-12-31T23:59:59'},
  { type: 'hot', code: 'FREESHIP', brandName: 'ECODEAL', brandLogo: 'https://placehold.co/100x100/D93F3F/white?text=PF', value: 'FREESHIP', condition: 'Miễn phí vận chuyển toàn quốc', totalQuantity: 1000, remainingQuantity: 345, expiryDate: '2026-11-30T23:59:59'},
  { type: 'hot', code: 'GIAM50PHANTRAM', brandName: 'ECODEAL', brandLogo: 'https://placehold.co/100x100/D93F3F/white?text=PF', value: 'GIẢM 50%', condition: 'Tối đa 30K', totalQuantity: 300, remainingQuantity: 213, expiryDate: '2026-10-20T23:59:59'},
  { type: 'hot', code: 'DEAL1K', brandName: 'Giờ Vàng', brandLogo: 'https://placehold.co/100x100/FFC107/black?text=1K', value: 'Deal sốc 1K', condition: 'Cho sản phẩm chỉ định trong Flash Sale', totalQuantity: 100, remainingQuantity: 78, expiryDate: '2026-08-25T12:00:00'},
  { type: 'hot', code: 'TANGKEMPEPSI', brandName: 'Đồ ăn nhanh', brandLogo: 'https://placehold.co/100x100/004B93/white?text=PEPSI', value: 'Tặng 1 Pepsi', condition: 'Đơn gà rán bất kỳ từ 99K', totalQuantity: 500, remainingQuantity: 430, expiryDate: '2026-09-27T23:59:59'},
  { type: 'hot', code: 'GIAM20K_ZALOPAY', brandName: 'ZaloPay', brandLogo: 'https://placehold.co/100x100/0068FF/white?text=ZLP', value: 'Giảm 20K', condition: 'Khi thực hiện thanh toán qua ZaloPay', totalQuantity: 1000, remainingQuantity: 800, expiryDate: '2026-12-31T23:59:59'},
  { type: 'hot', code: 'HOANTIEN20', brandName: 'ShopeePay', brandLogo: 'https://placehold.co/100x100/EE4D2D/white?text=SPP', value: 'Hoàn 20% xu', condition: 'Tối đa 50K xu cho mọi đơn hàng', totalQuantity: 800, remainingQuantity: 1, expiryDate: '2026-12-31T23:59:59'},
  { type: 'hot', code: 'LIXI88K', brandName: 'Tết Sale', brandLogo: 'https://placehold.co/100x100/E6002D/white?text=LIXI', value: 'Lì xì 88K', condition: 'Cho đơn hàng từ 888K', totalQuantity: 500, remainingQuantity: 430, expiryDate: '2027-01-28T23:59:59'},
  { type: 'hot', code: 'GIAM15_THOITRANG', brandName: 'Thời Trang', brandLogo: 'https://placehold.co/100x100/8A2BE2/white?text=FASH', value: 'Giảm 15%', condition: 'Cho ngành hàng thời trang nam nữ', totalQuantity: 400, remainingQuantity: 320, expiryDate: '2026-10-29T23:59:59'},
  { type: 'hot', code: 'VEPHIM99K', brandName: 'Lotte Cinema', brandLogo: 'https://placehold.co/100x100/ED1C24/white?text=LC', value: 'Cặp vé 99K', condition: 'Khi mua online qua ứng dụng', totalQuantity: 200, remainingQuantity: 112, expiryDate: '2026-11-28T23:59:59'},
];

const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();
    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());
    useEffect(() => {
        const interval = setInterval(() => {
            const timeLeft = countDownDate - new Date().getTime();
            if (timeLeft > 0) setCountDown(timeLeft);
            else {
                setCountDown(0);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [countDownDate]);
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return [days, hours, minutes, seconds].map(v => v.toString().padStart(2, '0'));
};

const VoucherCard = ({ voucher, onSave, isSaved }) => {
    const progress = (voucher.remainingQuantity / voucher.totalQuantity) * 100;
    const [days, hours, minutes, seconds] = useCountdown(voucher.expiryDate);
    const isExpired = days === '00' && hours === '00' && minutes === '00' && seconds === '00';

    const handleSaveClick = (e) => {
        e.stopPropagation();
        if (!isSaved && !isExpired) onSave(voucher.code);
    };
    
    // === THAY ĐỔI LOGIC DUY NHẤT TẠI ĐÂY ===
    const getProgressText = () => {
        if (voucher.remainingQuantity <= 0) {
            return "Đã hết lượt";
        }
        if (progress < 25) { // Dưới 25% thì báo gấp
            return `Nhanh tay! Còn ${voucher.remainingQuantity} suất`;
        }
        // Mặc định luôn hiển thị "Sắp hết! Còn..."
        return `Sắp hết! Còn ${voucher.remainingQuantity} suất`;
    };

    return (
        <motion.div
            layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`${styles.voucherCard} ${styles[voucher.type]} ${isExpired ? styles.expired : ''}`}
        >
            <div className={styles.voucherLeft}>
                <div className={styles.voucherBrand}>
                    <img src={voucher.brandLogo} alt={`${voucher.brandName} logo`} className={styles.brandLogoImg} />
                    <span className={styles.brandNameText}>{voucher.brandName}</span>
                </div>
                <div className={styles.voucherDetails}>
                    <h3 className={styles.voucherValue}>{voucher.value}</h3>
                    <p className={styles.voucherCondition}>{voucher.condition}</p>
                    <div className={styles.voucherProgress}>
                        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                        <div className={styles.progressTextWrapper}>
                            <span className={styles.progressText}>{getProgressText()}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.voucherRight}>
                <div className={styles.voucherTimer}>
                    <span>{isExpired ? 'Đã hết hạn' : 'Kết thúc sau'}</span>
                    <p>{isExpired ? '00:00:00:00' : `${days}:${hours}:${minutes}:${seconds}`}</p>
                </div>
                <button 
                    className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`} 
                    disabled={isExpired || isSaved}
                    onClick={handleSaveClick}
                >
                    {isExpired ? 'HẾT HẠN' : (isSaved ? 'ĐÃ LƯU' : 'LƯU')}
                </button>
            </div>
        </motion.div>
    );
};

const PromotionsPage = () => {
    const [vouchers, setVouchers] = useState(initialVouchers);
    const [savedVouchers, setSavedVouchers] = useState(new Set());

    const [visibleExclusiveCount, setVisibleExclusiveCount] = useState(INITIAL_VOUCHER_COUNT);
    const [visibleHotCount, setVisibleHotCount] = useState(INITIAL_VOUCHER_COUNT);

    const handleSaveVoucher = useCallback((voucherCode) => {
        setVouchers(prevVouchers =>
            prevVouchers.map(v => v.code === voucherCode ? { ...v, remainingQuantity: v.remainingQuantity - 1 } : v)
        );
        setSavedVouchers(prevSaved => new Set(prevSaved).add(voucherCode));
    }, []);

    const exclusiveVouchers = vouchers.filter(v => v.type === 'exclusive');
    const hotVouchers = vouchers.filter(v => v.type === 'hot');

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <PromotionBanner />

            {/* === PHẦN NỘI DUNG VOUCHER === */}
            <main className={styles.pageContainer}>
                {/* <header className={styles.pageHeader}>
                    <img src="/placeholders/deal-placeholder.svg" alt="Trang Săn Voucher" className={styles.headerBanner} />
                </header> */}

                {/* <PromotionBanner /> */}
                
                <section className={styles.voucherSection}>
                    <h2 className={styles.sectionTitle}>DEAL ĐỘC QUYỀN</h2>
                    <motion.div layout className={styles.voucherGrid}>
                        <AnimatePresence>
                            {exclusiveVouchers.slice(0, visibleExclusiveCount).map(v => (
                                <VoucherCard key={v.code} voucher={v} onSave={handleSaveVoucher} isSaved={savedVouchers.has(v.code)} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    {visibleExclusiveCount < exclusiveVouchers.length && (
                        <button 
                            className={styles.loadMoreButton} 
                            onClick={() => setVisibleExclusiveCount(current => current + VOUCHERS_PER_LOAD)}
                        >
                            Xem thêm
                        </button>
                    )}
                </section>

                <section className={styles.voucherSection}>
                    <h2 className={styles.sectionTitle}>ƯU ĐÃI NỔI BẬT</h2>
                    <motion.div layout className={styles.voucherGridHot}>
                         <AnimatePresence>
                            {hotVouchers.slice(0, visibleHotCount).map(v => (
                                <VoucherCard key={v.code} voucher={v} onSave={handleSaveVoucher} isSaved={savedVouchers.has(v.code)} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    {visibleHotCount < hotVouchers.length && (
                        <button 
                            className={styles.loadMoreButton} 
                            onClick={() => setVisibleHotCount(current => current + VOUCHERS_PER_LOAD)}
                        >
                            Xem thêm
                        </button>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default PromotionsPage;