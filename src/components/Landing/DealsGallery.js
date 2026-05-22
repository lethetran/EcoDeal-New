import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import DealCard from './DealCard';
import styles from './DealsGallery.module.css';

const dealsData = [
    { image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2070", title: "Bánh Mì Artisan", store: "Tiệm Bánh Mì Vui", originalPrice: "90.000", dealPrice: "35.000", statusText: "Còn 5 túi", isSoldOut: false },
    { image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070", title: "Salad Cầu Vồng", store: "Salad Garden", originalPrice: "110.000", dealPrice: "45.000", statusText: "Còn 2 túi", isSoldOut: false },
    { image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981", title: "Pizza Phô Mai", store: "Pizza 4P's", originalPrice: "250.000", dealPrice: "99.000", statusText: "Đã bán hết", isSoldOut: true },
    { image: "https://images.unsplash.com/photo-1484723050470-6b6e41b2a259?q=80&w=2070", title: "Bữa Sáng Năng Lượng", store: "The Coffee House", originalPrice: "85.000", dealPrice: "40.000", statusText: "Còn 3 túi", isSoldOut: false },
    { image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070", title: "Salad Cầu Vồng", store: "Salad Garden", originalPrice: "110.000", dealPrice: "45.000", statusText: "Còn 2 túi", isSoldOut: false },
    { image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070", title: "Salad Cầu Vồng", store: "Salad Garden", originalPrice: "110.000", dealPrice: "45.000", statusText: "Còn 2 túi", isSoldOut: false }

];

const DealsGallery = () => {
    return (
        <section id="deals-gallery" className={styles.dealsGallery}>
            <AnimateOnScroll>
                <h2>Phòng Trưng Bày Hương Vị</h2>
            </AnimateOnScroll>
            <div className={styles.galleryGrid}>
                {dealsData.map((deal, index) => (
                    <DealCard key={index} deal={deal} />
                ))}
            </div>
        </section>
    );
};

export default DealsGallery;