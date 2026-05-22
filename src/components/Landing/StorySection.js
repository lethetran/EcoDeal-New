import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import styles from './StorySection.module.css';

const StorySection = () => {
    return (
        <section id="story-section" className={styles.storySection}>
            <AnimateOnScroll>
                <div className={styles.storyText}>
                    <h2>Câu Chuyện Của Sự Trân Quý</h2>
                    <p>Chúng tôi tin rằng mọi thực phẩm đều mang một giá trị. FoodSave ra đời từ niềm đam mê kết nối và khát khao giảm thiểu lãng phí, biến những sản phẩm tươi ngon sắp hết hạn thành niềm vui trên bàn ăn của bạn.</p>
                </div>
            </AnimateOnScroll>
            <AnimateOnScroll>
                <div className={styles.storyImageWrapper}>
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974" alt="Người nông dân với rổ rau củ" />
                </div>
            </AnimateOnScroll>
        </section>
    );
};

export default StorySection;