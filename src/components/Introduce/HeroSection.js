import React from 'react';
import '../../pages/Introduce.css'; 

const HeroSection = () => {
  return (
    <section className="hero section">
      <div className="hero__container container_home grid">
        <div className="hero__content">
          <h1 className="hero__title">Giải cứu đồ ăn ngon,<br/>Tiết kiệm đến 70%!</h1>
          <p className="hero__description">
            Chung tay giảm lãng phí thực phẩm bằng cách kết nối với các cửa hàng, tiệm bánh và nhận ưu đãi hấp dẫn mỗi ngày.
          </p>
          <a href="/login" className="btn_home btn--primary btn--lg">
            Khám phá ngay <i className='bx bx-right-arrow-alt'></i>
          </a>
        </div>
        <div className="hero__image">
          <img src="https://i.imgur.com/rS08iS1.png" alt="Rescued food illustration" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;