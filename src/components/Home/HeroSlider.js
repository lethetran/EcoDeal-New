import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './HeroSlider.css'; // Import your CSS styles

const promotionalSlides = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', title: 'Ưu Đãi Nóng Hổi, Giao Nhanh Chóng', subtitle: 'Khám phá hàng ngàn món ngon sắp hết hạn với giá không thể tốt hơn.' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop', title: 'Tiết Kiệm Thông Minh, Bảo Vệ Trái Đất', subtitle: 'Mỗi đơn hàng của bạn là một hành động ý nghĩa giúp giảm thiểu lãng phí thực phẩm.' },
];

const sliderVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] } },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] } },
};

const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: 'easeOut' } },
};

const progressVariants = {
    initial: { width: '0%' },
    animate: { width: '100%', transition: { duration: 7, ease: 'linear' } },
}

const AnimatedText = ({ text }) => {
  const words = text.split(" ").map(word => [...word, '\u00A0']); // Thêm dấu cách để không bị dính vào nhau

  return (
    <motion.h1 variants={contentVariants} initial="initial" animate="animate" className="slide__title">
      {words.map((word, i) => (
        <motion.span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{
              initial: { y: "100%" },
              animate: { y: 0, transition: { delay: 0.5 + i * 0.1, ease: 'easeOut' } }
            }}
          >
            {word}
          </motion.span>
        </motion.span>
      ))}
    </motion.h1>
  );
};

const HeroSlider = ({ userName }) => {
  const hasUser = Boolean((userName || '').trim());
  const greetingSlide = {
    type: 'greeting',
    title: hasUser ? `Chào ${userName}!` : 'Xin chào!',
    subtitle: hasUser
      ? 'Cùng xem hôm nay có ưu đãi nào hấp dẫn nhé.'
      : 'Đăng nhập để đăng bài và đặt hàng nhanh hơn.',
  };

  // Luôn bắt đầu bằng slide chào để tránh cảm giác rời rạc giữa khách và user đã đăng nhập.
  const [index, setIndex] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const allSlides = [greetingSlide, ...promotionalSlides];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % allSlides.length);
    }, 7000); // Thời gian chuyển slide
    return () => clearInterval(timer);
  }, [allSlides.length]);

  const currentSlide = allSlides[index];
  
  return (
    <section className="hero-slider" ref={heroRef}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="slide"
          variants={sliderVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div className="slide__background-container" style={{ y: backgroundY }}>
            {currentSlide.type === 'greeting' ? (
                <img className="slide__background" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" alt="Greeting background" />
            ) : currentSlide.type === 'video' ? (
              <video className="slide__background" src={currentSlide.src} autoPlay muted loop playsInline />
            ) : (
              <img className="slide__background" src={currentSlide.src} alt={currentSlide.title} />
            )}
          </motion.div>
          <div className="slide__overlay" />
          <div className="slide__content">
            {currentSlide.type === 'greeting' ? <AnimatedText text={currentSlide.title} /> : <motion.h1 variants={contentVariants} initial="initial" animate="animate" className="slide__title">{currentSlide.title}</motion.h1>}
            <motion.p variants={contentVariants} initial="initial" animate="animate" className="slide__subtitle">{currentSlide.subtitle}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      <motion.div
        key={index}
        className="slider__progress-bar"
        variants={progressVariants}
        initial="initial"
        animate="animate"
      />
    </section>
  );
};

export default HeroSlider;