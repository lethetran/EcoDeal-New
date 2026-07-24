import React from 'react';
import '../../pages/PartnerPage.css'; 

function PartnerHero() {
  return (
    <section className="partner-hero">
      <div className="partner-hero__content">
        <h1 className="partner-hero__title">Phát triển kinh doanh cùng ECODEAL</h1>
        <p className="partner-hero__subtitle">Biến thực phẩm dư thừa thành cơ hội, tiếp cận hàng ngàn khách hàng mới và tăng doanh thu hiệu quả.</p>
        <a href="#register-form" className="btn btn--outline-accent btn--large hero-cta-btn">Đăng ký ngay!</a>
      </div>
    </section>
  );
}

export default PartnerHero;