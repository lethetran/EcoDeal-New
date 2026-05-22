import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header'; // Điều chỉnh đường dẫn nếu cần
import ProductCard from '../components/ProductCard/ProductCard';
import Footer from '../components/Footer/Footer';
import { FaHeart, FaStar } from 'react-icons/fa';

// Import CSS Module đúng cách
import styles from './Product.module.css';

// === DỮ LIỆU MẪU ===
const productData = {
  name: "Combo Burger Thịt Bò Đặc Biệt",
  mainImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
  thumbnails: [ "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", "https://i.pinimg.com/736x/f9/00/7f/f9007f73da46783cb255a1e621637f27.jpg", "https://images.unsplash.com/photo-1603064752734-4b4bfb15b3a3?w=200", "https://images.unsplash.com/photo-1606132910793-27883a9364b4?w=200", ],
  store: { name: "Tiệm Burger House", distance: "1.2km" },
  price: { new: 60000, old: 120000, discount: 50 },
  description: "Một phần ăn đầy đặn giúp bạn no căng bụng. Bao gồm một burger bò phô mai hảo hạng, khoai tây chiên giòn rụm và một ly Coca-Cola mát lạnh.",
  rescueStatus: { expiryDate: "Hôm nay", remaining: 12, reason: "Sản phẩm tươi, bán trong ngày", savedCount: 188, },
  reviews: [ { id: 1, name: "Minh Anh", rating: 5, comment: "Mình đã giải cứu thành công! Bánh vẫn rất ngon, mềm và thơm. Ủng hộ mô hình ý nghĩa này của shop." }, { id: 2, name: "Thanh Hằng", rating: 5, comment: "Giá quá tốt cho chất lượng này. Giao hàng nhanh. Cảm ơn vì đã giúp mình tiết kiệm và bảo vệ môi trường." } ],
  moreFromStore: [
    { id: 10, name: 'Bánh Mì Gối Yến Mạch Tươi Ngon Bổ Dưỡng', price: 25000, originalPrice: 40000, img: 'https://images.unsplash.com/photo-1581334437634-4050d28a3a2b?w=400', expiry: 'Còn 8 giờ', stock: 12, store: { name: 'Tiệm Burger House', distance: '1.2km' } },
    { id: 11, name: 'Hộp 4 Bánh Tart Trứng Béo Ngậy', price: 39000, originalPrice: 60000, img: 'https://images.unsplash.com/photo-1604424997233-f542a299386c?w=400', expiry: 'Còn 3 giờ', stock: 8, store: { name: 'Tiệm Burger House', distance: '1.2km' } },
    { id: 12, name: 'Bánh Bông Lan Trứng Muối', price: 59000, originalPrice: 90000, img: 'https://images.unsplash.com/photo-1607813843521-8b2b7540f316?w=400', expiry: 'Còn 5 giờ', stock: 4, store: { name: 'Tiệm Burger House', distance: '1.2km' } },
    { 
    id: 30, 
    name: 'Túi Cà Chua Bi Sạch VietGAP (500g)', 
    price: 29000, 
    originalPrice: 45000, 
    img: 'https://images.unsplash.com/photo-1591997365872-9b6d8b13d3d1?w=400', 
    expiry: 'Còn 2 ngày', 
    stock: 18, 
    store: { id: 'nong-trai-xanh', name: 'Nông Trại Xanh', distance: '1.5km' } 
  },
  { 
    id: 31, 
    name: 'Bó Xà Lách Romain Tươi Mơn Mởn', 
    price: 15000, 
    originalPrice: 25000, 
    img: 'https://images.unsplash.com/photo-1605651230822-6b9911855a82?w=400', 
    expiry: 'Hôm nay', 
    stock: 9, 
    store: { id: 'nong-trai-xanh', name: 'Nông Trại Xanh', distance: '1.5km' } 
  },
  { 
    id: 32, 
    name: 'Khay Nấm Đùi Gà Hữu Cơ', 
    price: 35000, 
    originalPrice: 55000, 
    img: 'https://images.unsplash.com/photo-1598112599052-19e4922153b8?w=400', 
    expiry: 'Còn 3 ngày', 
    stock: 11, 
    store: { id: 'nong-trai-xanh', name: 'Nông Trại Xanh', distance: '1.5km' } 
  },
  { 
    id: 33, 
    name: 'Bơ Sáp 034 Chín Cây (Túi 1kg)', 
    price: 49000, 
    originalPrice: 80000, 
    img: 'https://images.unsplash.com/photo-1601035432328-31a2380d5b4a?w=400', 
    expiry: 'Còn 2 ngày', 
    stock: 7, 
    store: { id: 'nong-trai-xanh', name: 'Nông Trại Xanh', distance: '1.5km' } 
  },
  { 
    id: 34, 
    name: 'Túi Chanh Vàng Không Hạt Nhập Khẩu', 
    price: 39000, 
    originalPrice: 60000, 
    img: 'https://images.unsplash.com/photo-1587496679742-9694b7be8202?w=400', 
    expiry: 'Còn 1 tuần', 
    stock: 25, 
    store: { id: 'nong-trai-xanh', name: 'Nông Trại Xanh', distance: '1.5km' } 
  },
  { 
    id: 35, 
    name: 'Bông Cải Xanh Tươi VietGAP', 
    price: 22000, 
    originalPrice: 35000, 
    img: 'https://images.unsplash.com/photo-1584285418195-217a86f1577a?w=400', 
    expiry: 'Còn 2 ngày', 
    stock: 14, 
    store: { id: 'nong-trai-xanh', name: 'Nông Trại Xanh', distance: '1.5km' } 
  }
  ],
  otherStoreSuggestions: [
    { id: 20, name: 'Hộp Dâu Tây Đà Lạt Siêu To (500g)', price: 69000, originalPrice: 100000, img: 'https://images.unsplash.com/photo-1588313111242-27637812b1b3?w=400', expiry: 'Còn 1 ngày', stock: 15, store: { id: 101, name: 'Nông sản Sạch Xanh Lá Cây To Khổng Lồ', distance: '2.5km' } },
    { id: 21, name: 'Sữa Chua Hy Lạp Tự Nhiên Không Đường', price: 19000, originalPrice: 30000, img: 'https://images.unsplash.com/photo-1634923120159-f22198d08918?w=400', expiry: 'Còn 2 ngày', stock: 20, store: { id: 102, name: 'Tiệm Sữa Nhà Làm', distance: '3.1km' } },
    { id: 22, name: 'Ức Gà Phi Lê Tươi Sạch Mỗi Ngày', price: 45000, originalPrice: 65000, img: 'https://images.unsplash.com/photo-1608272166945-31a8ea645229?w=400', expiry: 'Hôm nay', stock: 9, store: { id: 103, name: 'Thực phẩm An Toàn Vì Sức Khỏe', distance: '1.8km' } },
     { id: 40, 
    name: 'Túi Khoai Tây Bi Đà Lạt (1kg)', 
    price: 25000, 
    originalPrice: 40000, 
    img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', 
    expiry: 'Còn 4 ngày', 
    stock: 22, 
    store: { id: 'nong-san-da-lat', name: 'Nông Sản Đà Lạt', distance: '3.8km' } 
  },
  { 
    id: 41, 
    name: 'Túi Cà Rốt Sạch Hữu Cơ', 
    price: 19000, 
    originalPrice: 30000, 
    img: 'https://images.unsplash.com/photo-1590422229567-775836450618?w=400', 
    expiry: 'Còn 3 ngày', 
    stock: 17, 
    store: { id: 'rau-cu-sach', name: 'Rau Củ Sạch 3 Miền', distance: '2.1km' } 
  },
  { 
    id: 42, 
    name: 'Chùm Táo Envy Nhập Khẩu Mỹ', 
    price: 79000, 
    originalPrice: 120000, 
    img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b69665?w=400', 
    expiry: 'Còn 5 ngày', 
    stock: 10, 
    store: { id: 'fruitopia', name: 'Fruitopia', distance: '4.2km' } 
  },
  { 
    id: 43, 
    name: 'Bắp Cải Thảo Tươi Ngon', 
    price: 12000, 
    originalPrice: 20000, 
    img: 'https://images.unsplash.com/photo-1614138111166-1a89c7c72551?w=400', 
    expiry: 'Hôm nay', 
    stock: 8, 
    store: { id: 'vuon-an-lanh', name: 'Vườn An Lành', distance: '2.9km' } 
  },
  { 
    id: 44, 
    name: 'Tỏi Cô Đơn Lý Sơn (Túi 200g)', 
    price: 45000, 
    originalPrice: 65000, 
    img: 'https://images.unsplash.com/photo-1582379391942-75d1f274a72d?w=400', 
    expiry: 'Còn 2 tuần', 
    stock: 30, 
    store: { id: 'cho-nong-san', name: 'Chợ Nông Sản Online', distance: '3.5km' } 
  },
  { 
    id: 45, 
    name: 'Dưa Chuột Baby Sạch Giòn', 
    price: 18000, 
    originalPrice: 28000, 
    img: 'https://images.unsplash.com/photo-1582287232938-958897a38f0d?w=400', 
    expiry: 'Còn 2 ngày', 
    stock: 13, 
    store: { id: 'bach-hoa-xanh', name: 'Bách Hóa Xanh', distance: '950m' } 
  }
  ]
};


function ProductDetailPage() {
  const [currentImage, setCurrentImage] = useState(productData.mainImage);
  const [thumbnails, setThumbnails] = useState(productData.thumbnails);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(productData.reviews);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleThumbnailClick = (clickedThumbnail) => {
    const oldMainImage = currentImage;
    setCurrentImage(clickedThumbnail);
    
    // === DÒNG 104 ĐÃ ĐƯỢC SỬA LỖI TỪ -d_meta' THÀNH 'thumbnails' ===
    const newThumbnails = thumbnails.map(thumb => 
        thumb === clickedThumbnail ? oldMainImage.replace('w=800', 'w=200') : thumb
    );
    setThumbnails(newThumbnails);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + amount;
      return newQuantity < 1 ? 1 : newQuantity;
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim() || newReviewRating === 0) {
      alert("Vui lòng nhập nhận xét và chọn số sao nhé!");
      return;
    }
    
    setIsSubmitting(true);
    const newReview = {
      id: Date.now(),
      name: "Bạn",
      rating: newReviewRating,
      comment: newReviewText,
    };
    
    setTimeout(() => {
      setReviews([newReview, ...reviews]);
      setNewReviewText('');
      setNewReviewRating(5);
      setIsSubmitting(false);
    }, 1000);
  };
const [isAnimating, setIsAnimating] = useState(false); // Thêm state mới
const handleChange = (amount) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + amount;
      return newQuantity < 1 ? 1 : newQuantity;
    });
    
    // Kích hoạt animation
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <>
      <Header /> 
      <main>
        <section className={`${styles['product-detail']} ${styles.section}`}>
            <div className={`${styles.container} ${styles.grid} ${styles['product-detail__container']}`}>
                <div className={styles['product-detail__gallery']}>
                    <div className={styles['gallery__main-image']}>
                        <img src={currentImage} alt={productData.name} />
                    </div>
                    <div className={styles['gallery__thumbnails']}>
                        {thumbnails.map((thumbSrc, index) => (
                          <div key={index} className={styles.thumbnail} onClick={() => handleThumbnailClick(thumbSrc)}>
                            <img src={thumbSrc} alt={`Thumbnail ${index + 1}`} />
                          </div>
                        ))}
                    </div>
                </div>

                <div className={styles['product-detail__info']}>
                    <h1 className={styles.info__title}>{productData.name}</h1>
                    <div className={styles.info__store_meta}>
                        <a href="#" className={styles['store_meta__name']}>
                            <i className='bx bxs-store-alt'></i>
                            <span>{productData.store.name}</span>
                        </a>
                        <span className={styles['store-d_meta__divider']}></span>
                        <span className={styles['store-d_meta__distance']}><i className='bx bxs-map'></i> Cách bạn {productData.store.distance}</span>
                    </div>
                    <div className={styles.info__price}>
                        <span className={styles['price--new']}>{productData.price.new.toLocaleString('vi-VN')}đ</span>
                        <span className={styles['price--old']}>{productData.price.old.toLocaleString('vi-VN')}đ</span>
                        <span className={styles['price__discount-badge']}>- {productData.price.discount}%</span>
                    </div>

                    <div className={styles.info__description}>
                        <p>{productData.description}</p>
                    </div>
                    
                    <div className={styles.info__quantity}>
                        <label>Số lượng</label>
                        <div 
  className={`${styles['quantity-selector']} ${isAnimating ? styles.pulse : ''}`}
>
    {/* Dùng span thay cho button */}
    <span className={styles['quantity-control']} onClick={() => handleChange(-1)}>-</span>
    
    {/* Dùng span thay cho input để dễ tạo kiểu hơn */}
    <span className={styles['quantity-display']}>{quantity}</span>
    
    {/* Dùng span thay cho button */}
    <span className={styles['quantity-control']} onClick={() => handleChange(1)}>+</span>
</div>
                    </div>
                
                    <div className={styles['info__delivery-options']}>
                        <label className={styles['delivery-option']}>
                            <input type="radio" name="delivery_method" value="delivery" defaultChecked />
                            <span className={styles['custom-radio']}></span>
                            <div className={styles['option-details']}>
                                <span className={styles['option-title']}>Giao hàng tận nơi</span>
                                <span className={styles['option-desc']}>Dự kiến giao trong 25-30 phút</span>
                            </div>
                            <i className={`bx bxs-truck ${styles['option-icon']}`}></i>
                        </label>
                        <label className={styles['delivery-option']}>
                            <input type="radio" name="delivery_method" value="pickup" />
                            <span className={styles['custom-radio']}></span>
                            <div className={styles['option-details']}>
                                <span className={styles['option-title']}>Đến cửa hàng lấy</span>
                                <span className={styles['option-desc']}>Sẵn sàng trong 15-20 phút</span>
                            </div>
                            <i className={`bx bxs-store-alt ${styles['option-icon']}`}></i>
                        </label>
                    </div>
                    <div className={styles.info__actions}>
                        <button className={`${styles.btn} ${styles['btn--secondary']}`}>
                            <i className='bx bx-cart-add'></i>
                            <span>Thêm vào giỏ</span>
                        </button>
                        <button className={`${styles.btn} ${styles['btn--primary']}`}>Mua ngay</button>
                    </div>

                </div>
            </div>
        </section>

        <div className={`${styles.container} ${styles['product-extra-info']}`}>
            <section className={styles['product-section']}>
                <h2 className={styles.section__title}>Sản phẩm khác của {productData.store.name}</h2>
                <div className={styles['cross-sell-grid']}> 
                    {productData.moreFromStore.map(item => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </section>
            
            <section className={styles['product-section']}>
                <h2 className={styles.section__title}>Phản hồi</h2>
                <div className={styles.reviews__container}>
                    {reviews.map(review => (
                        <div key={review.id} className={styles['review-card']}>
                            <div className={styles['review-header']}>
                                <div className={styles['review-rating']}>
                                    {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                                </div>
                                <span className={styles['review-author']}>{review.name}</span>
                            </div>
                            <p className={styles['review-comment']}>"{review.comment}"</p>
                        </div>
                    ))}
                </div>

                <div className={styles['review-form-card']}>
                    <h3 className={styles['form-title']}>Chia sẻ trải nghiệm giải cứu của bạn</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className={styles['rating-input-container']}>
                            <span>Đánh giá của bạn:</span>
                            <div className={styles['stars-wrapper']} onMouseLeave={() => setHoverRating(0)}>
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <button
                                            type="button"
                                            key={starValue}
                                            className={`${styles.starIcon} ${starValue <= (hoverRating || newReviewRating) ? styles.active : ''}`}
                                            onClick={() => setNewReviewRating(starValue)}
                                            onMouseEnter={() => setHoverRating(starValue)}
                                        >
                                            <FaStar />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <textarea
                            className={styles['review-textarea']}
                            rows="1"
                            placeholder="Sản phẩm có ngon không, bạn có hài lòng với cuộc giải cứu này không?..."
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                        />
                        <button type="submit" className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--submit-review']}`} disabled={isSubmitting}>
                            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </form>
                </div>
            </section>

             <section className={styles['product-section']}>
                <h2 className={styles.section__title}>Có thể bạn quan tâm</h2>
                <div className={styles['cross-sell-grid']}>
                    {productData.otherStoreSuggestions.map(item => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </section>
        </div>
      </main>
        <Footer />
    </>
  );
}

export default ProductDetailPage;