// src/pages/StoreDetailPage/StoreDetailPage.jsx
// Phiên bản hoàn thiện, đầy đủ dữ liệu và cấu trúc JSX

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './StoreDetailPage.module.css';
import { FaMapMarkerAlt, FaStar, FaClock, FaPlus, FaTags, FaShippingFast } from 'react-icons/fa';
import Card from '../components/CartPage/Card'; // **QUAN TRỌNG**: Đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer'; // Nếu bạn muốn sử dụng Footer, hãy bỏ comment dòng này
// === DỮ LIỆU MẪU ===
const storeData = {
    id: 'sl-diner-hoang-cau',
    name: "S&L's Diner Hoang Cau",
    address: '109 P. Hoàng Cầu, Chợ Dừa, Đống Đa, Hà Nội',
    mapUrl:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.196940809241!2d105.8193280759939!3d21.02388338062098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab6606138679%3A0x3c73447b1990c0a3!2zMTA5IFAuIEhvw6BuZyBD4bqndSwgQ2jhu6MgTOG7q2EsIMSQ4buRbmcgxJBhLCBIw6AgTuG7mWksIFZp4buHdG5hbQ!5e0!3m2!1svi!2s!4v1721467530661!5m2!1svi!2s',
    rating: 4.8,
    reviews: 532,
    openingHours: '09:00 - 22:00',
    bannerUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1600&h=900&fit=crop',
    logoUrl: 'https://i.pinimg.com/736x/29/eb/d5/29ebd50aac869c65fa1d0cf2c1da16d1.jpg',
    tags: ['Burger', 'Món Mỹ', 'Gà Rán', 'Ăn nhanh'],
    vouchers: [
        { code: 'GIAM15', title: 'Giảm 15% tối đa 30K' },
        { code: 'FREESHIP', title: 'Miễn phí vận chuyển' },
        { code: 'KHAO50K', title: 'Giảm 50K đơn đầu' },
    ],
    products: [
        { 
            id: 1, 
            name: 'Burger Bò Đặc Biệt Phô Mai Tan Chảy', 
            originalPrice: 119000, // <-- Giá cũ (tùy chọn)
            price: 89000,          // <-- Giá mới (giá khuyến mại)
            img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 
            isBestSeller: true,
            stock: 15,             // <-- Số lượng còn lại
            expiry: '2025-12-31'   // <-- Hạn sử dụng
        },
        { 
            id: 2, 
            name: 'Burger Gà Giòn Cay Sốt Mayo',
            originalPrice: null,   // <-- Sản phẩm không giảm giá
            price: 79000, 
            img: 'https://images.unsplash.com/photo-1603614588339-36c9a2d33b3a?w=400', 
            isBestSeller: false,
            stock: 30,
            expiry: '2025-12-31'
        },
        {
            id: 3, 
            name: 'Combo Gà Rán 2 người (2 miếng gà, 2 khoai, 2 nước)',
            originalPrice: 249000, // <-- Giá cũ
            price: 199000,         // <-- Giá mới
            img: 'https://images.unsplash.com/photo-1626082929543-5bab3f09d342?w=400', 
            isBestSeller: true,
            stock: 5,              // <-- Sắp hết hàng
            expiry: '2025-12-25'
        },
        { 
            id: 1, 
            name: 'Burger Bò Đặc Biệt Phô Mai Tan Chảy', 
            originalPrice: 119000, // <-- Giá cũ (tùy chọn)
            price: 89000,          // <-- Giá mới (giá khuyến mại)
            img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 
            isBestSeller: true,
            stock: 15,             // <-- Số lượng còn lại
            expiry: '2025-12-31'   // <-- Hạn sử dụng
        },
        { 
            id: 2, 
            name: 'Burger Gà Giòn Cay Sốt Mayo',
            originalPrice: null,   // <-- Sản phẩm không giảm giá
            price: 79000, 
            img: 'https://images.unsplash.com/photo-1603614588339-36c9a2d33b3a?w=400', 
            isBestSeller: false,
            stock: 30,
            expiry: '2025-12-31'
        },
        {
            id: 3, 
            name: 'Combo Gà Rán 2 người (2 miếng gà, 2 khoai, 2 nước)',
            originalPrice: 249000, // <-- Giá cũ
            price: 199000,         // <-- Giá mới
            img: 'https://images.unsplash.com/photo-1626082929543-5bab3f09d342?w=400', 
            isBestSeller: true,
            stock: 5,              // <-- Sắp hết hàng
            expiry: '2025-12-25'
        },
        { 
            id: 1, 
            name: 'Burger Bò Đặc Biệt Phô Mai Tan Chảy', 
            originalPrice: 119000, // <-- Giá cũ (tùy chọn)
            price: 89000,          // <-- Giá mới (giá khuyến mại)
            img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 
            isBestSeller: true,
            stock: 15,             // <-- Số lượng còn lại
            expiry: '2025-12-31'   // <-- Hạn sử dụng
        },
        { 
            id: 2, 
            name: 'Burger Gà Giòn Cay Sốt Mayo',
            originalPrice: null,   // <-- Sản phẩm không giảm giá
            price: 79000, 
            img: 'https://images.unsplash.com/photo-1603614588339-36c9a2d33b3a?w=400', 
            isBestSeller: false,
            stock: 30,
            expiry: '2025-12-31'
        },
        {
            id: 3, 
            name: 'Combo Gà Rán 2 người (2 miếng gà, 2 khoai, 2 nước)',
            originalPrice: 249000, // <-- Giá cũ
            price: 199000,         // <-- Giá mới
            img: 'https://images.unsplash.com/photo-1626082929543-5bab3f09d342?w=400', 
            isBestSeller: true,
            stock: 5,              // <-- Sắp hết hàng
            expiry: '2025-12-25'
        },
    ]
};

const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, 
        },
    },
};

const productVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100
        },
    },
};

const StoreDetailPage = () => {
    return (
        <>
        <Header />
        <div className={styles.pageWrapper}>
            <header className={styles.storeHeader}>
                <div className={styles.bannerImage} style={{ backgroundImage: `url(${storeData.bannerUrl})` }} />
                <div className={styles.headerOverlay} />
            </header>

            <div className={styles.mainContainer}>
                <div className={styles.infoBox}>
                    <div className={styles.infoBox_LogoContainer}>
                        <img src={storeData.logoUrl} alt={`${storeData.name} logo`} className={styles.storeLogo} />
                    </div>
                    <div className={styles.infoBox_DetailsContainer}>
                        <h1 className={styles.storeName}>{storeData.name}</h1>
                        <p className={styles.storeAddress}><FaMapMarkerAlt /> {storeData.address}</p>
                        <div className={styles.tagsContainer}>
                            {storeData.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                        </div>
                    </div>
                    <div className={styles.infoBox_MetaContainer}>
                        <div className={styles.metaItem}>
                            <FaStar className={styles.metaIcon} style={{ color: 'var(--color-accent)' }} />
                            <div>
                                <strong>{storeData.rating}</strong>
                                <span>({storeData.reviews}+ đánh giá)</span>
                            </div>
                        </div>
                        <div className={styles.metaItem}>
                            <FaClock className={styles.metaIcon} />
                            <div>
                                <strong>Giờ mở cửa</strong>
                                <span>{storeData.openingHours}</span>
                            </div>
                        </div>
                        <div className={styles.metaItem}>
                            <FaShippingFast className={styles.metaIcon} />
                            <div>
                                <strong>Giao hàng</strong>
                                <span>Nhanh & Đúng hẹn</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.storeLayout}>
                    <main className={styles.menuColumn}>
                        <h2 className={styles.sectionTitle}>Thực đơn nổi bật</h2>
                        <motion.div
                            className={styles.productGrid}
                            variants={gridContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            {storeData.products.map(p => (
    <motion.div key={p.id} variants={productVariants}>
        <div className={styles.productCard_v3}> 
            <div className={styles.cardImageContainer}>
                {/* THAY ĐỔI 1: Bọc hình ảnh bằng Link để chuyển đến trang chi tiết sản phẩm */}
                <Link to={`/product/${p.id}`}>
                    <img src={p.img} alt={p.name} className={styles.cardImage} />
                </Link>
                
                {p.originalPrice && (
                    <span className={styles.cardDiscountTag}>
                        -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                    </span>
                )}
                
                <button className={styles.cardTopCartBtn} aria-label="Thêm vào giỏ hàng">
                    <i className='bx bx-cart-add'></i>
                </button>
            </div>

            <div className={styles.cardContent}>
                {/* THAY ĐỔI 2: Bọc tên sản phẩm bằng Link (Tùy chọn nhưng nên làm) */}
                <Link to={`/product/${p.id}`} className={styles.storeLink}>
                    <h3 className={styles.cardTitle}>{p.name}</h3>
                </Link>
                
                <div className={styles.cardMeta}>
                    <div className={styles.metaItem_v3}>
                        <i className='bx bx-time-five'></i>
                        <span>Còn lại {Math.floor(Math.random() * 5) + 1} giờ</span>
                    </div>
                    <div className={styles.metaItem_v3}>
                        <i className='bx bx-box'></i>
                        <span>Còn lại: {p.stock}</span>
                    </div>
                </div>
                
                <div className={styles.cardStoreInfo}>
    <Link to={`/store/${storeData.id}`} className={styles.storeLink}>
        {/* Tên cửa hàng và khoảng cách bây giờ là anh em trực tiếp */}
        <span className={styles.storeName_v3}>{storeData.name.split('-')[0].trim()}</span>
        <span className={styles.storeDistance}>{Math.floor(Math.random() * 900) + 100}m</span>
    </Link>
</div>

                <div className={styles.cardFooter}>
                    <div className={styles.cardPrice}>
                        <span className={styles.priceNew}>{p.price.toLocaleString('vi-VN')}đ</span>
                        {p.originalPrice && (
                            <span className={styles.priceOld}>{p.originalPrice.toLocaleString('vi-VN')}đ</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
                            ))}
                        </motion.div>
                    </main>

                    <aside className={styles.sidebarColumn}>
                        <div className={styles.stickySidebar}>
                            <Card className={styles.sidebarCard}>
                                <h3 className={styles.cardTitle1}><FaTags /> Ưu đãi của cửa hàng</h3>
                                <div className={styles.voucherList}>
                                    {storeData.vouchers.map(v => (
                                        <div key={v.code} className={styles.voucherItem}>
                                            <div className={styles.voucherIcon}><FaTags /></div>
                                            <div className={styles.voucherDetails}>
                                                <strong>{v.title}</strong>
                                                <span>Mã: {v.code}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                             <Card className={styles.sidebarCard}>
                                <h3 className={styles.cardTitle1}><FaMapMarkerAlt /> Vị trí trên bản đồ</h3>
                                <div className={styles.mapPlaceholder}>
                                    <iframe 
                                        src={storeData.mapUrl}
                                        width="100%" 
                                        height="200" 
                                        style={{ border: 0 }} 
                                        allowFullScreen="" 
                                        loading="lazy"
                                        title="Store Location"
                                    ></iframe>
                                </div>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default StoreDetailPage;