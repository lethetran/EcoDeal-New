import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
  // Tính toán % giảm giá một cách an toàn
  const discountPercent = (product.originalPrice && product.price)
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

    // 3. Tạo một hàm xử lý riêng cho việc click vào tên cửa hàng
  const handleStoreClick = (e, storeId) => {
    // Ngăn sự kiện click này "nổi bọt" lên thẻ Link cha
    e.stopPropagation(); 
    e.preventDefault(); // Ngăn hành vi mặc định của link
    
    // Điều hướng đến trang cửa hàng
    navigate(`/store/${storeId}`);
  };


  return (
    <Link to={`/product/${product.id}`} className={styles.cardLink}>
      <div className={styles.productCard}>
        {/* === PHẦN HÌNH ẢNH === */}
        <div className={styles.imageContainer}>
          <img src={product.img} alt={product.name} className={styles.productImage} />
          
          {discountPercent && (
            <span className={styles.discountTag}>
              -{discountPercent}%
            </span>
          )}

          <button 
            className={styles.cartButton} 
            onClick={(e) => { 
              e.stopPropagation();
              e.preventDefault(); 
              alert(`Đã thêm "${product.name}" vào giỏ hàng!`); 
            }}
            aria-label="Thêm vào giỏ hàng"
          >
            <i className='bx bx-cart-add'></i>
          </button>
        </div>

        {/* === PHẦN NỘI DUNG === */}
        <div className={styles.contentContainer}>
          <h3 className={styles.productName}>{product.name}</h3>

          <div className={styles.metaInfo}>
            {product.expiry && <span><i className='bx bx-time-five'></i> {product.expiry}</span>}
            {product.stock && <span><i className='bx bx-box'></i> Còn lại: {product.stock}</span>}
          </div>
          
          <hr className={styles.divider} />

          <div className={styles.storeInfo}>
            {/* Tên cửa hàng bây giờ là một span có sự kiện onClick riêng */}
            <span 
              className={styles.storeName} 
              onClick={(e) => handleStoreClick(e, product.store.id)}
            >
              {product.store.name}
            </span>
            {product.store?.distance && <span className={styles.distance}>{product.store.distance}</span>}
          </div>

          <div className={styles.priceInfo}>
            <span className={styles.newPrice}>{product.price.toLocaleString('vi-VN')}đ</span>
            {product.originalPrice && (
              <span className={styles.oldPrice}>{product.originalPrice.toLocaleString('vi-VN')}đ</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;