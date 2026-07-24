import React from 'react';
import styles from './CartItem.module.css';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import QuantitySelector from './QuantitySelector';

const CartItem = ({ item, isSelected, onSelect, onQuantityChange, onRemove }) => {
    return (
        // Không dùng Card nữa vì giờ có group Store
        <div className={`${styles.cartItem} ${isSelected ? styles.selected : ''}`}>
            <div className={styles.selectionArea}>
                <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                />
            </div>
            <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
            <div className={styles.itemInfo}>
                <Link to={`/products/${item.id}`} className={styles.itemNameLink}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                </Link>
                <div className={styles.priceWrapper}>
                    {/* Luôn hiển thị giá hiện tại (có thể là giá KM) */}
                    <span className={styles.currentPrice}>
                        {item.price.toLocaleString('vi-VN')}₫
                    </span>
                    
                    {/* Nếu có giá gốc thì hiển thị nó, gạch đi */}
                    {item.originalPrice && (
                        <span className={styles.originalPrice}>
                            {item.originalPrice.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                    {item.originalPrice && (
                    // Dùng React Fragment (<>) để nhóm 2 phần tử lại với nhau
                    <>
                        {/* <span className={styles.originalPrice}>
                            {item.originalPrice.toLocaleString('vi-VN')}₫
                        </span> */}
                        
                        {/* THÊM MỚI: Tag hiển thị % giảm giá */}
                        <span className={styles.discountBadge}>
                            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                    </>
                )}
                </div>
                <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => onQuantityChange(item.id, item.quantity + 1)}
                    onDecrease={() => onQuantityChange(item.id, item.quantity - 1)}
                />
            </div>
            <div className={styles.itemActions}>
                <strong className={styles.itemTotalPrice}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                </strong>
                <button onClick={() => onRemove(item.id)} className={styles.removeButton}>
                    <FaTrashAlt />
                </button>
            </div>
        </div>
    );
};

export default CartItem;