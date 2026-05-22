// src/components/CartPage/YouMightLike.jsx
import React from 'react';
import styles from './YouMightLike.module.css';
import Card from './Card';

const suggestedItems = [
    { id: 4, name: 'Salad Trộn Dầu Giấm', price: 69000, imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=200' },
    { id: 5, name: 'Nước ép dứa', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200' },
    { id: 6, name: 'Pizza Hải Sản', price: 159000, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' },
    { id: 7, name: 'Mỳ Ý Sốt Bò Bằm', price: 129000, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e326e22e3924?w=200' }
];

const YouMightLike = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Có thể bạn sẽ thích</h2>
            <div className={styles.grid}>
                {suggestedItems.map(item => (
                    <Card key={item.id} className={styles.suggestionCard}>
                        <img src={item.imageUrl} alt={item.name} className={styles.suggestionImage} />
                        <div className={styles.suggestionInfo}>
                            <h4 className={styles.suggestionName}>{item.name}</h4>
                            <p className={styles.suggestionPrice}>{item.price.toLocaleString('vi-VN')}₫</p>
                            <button className={styles.addButton}>Thêm</button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default YouMightLike;