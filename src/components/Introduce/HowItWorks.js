import React from 'react';
import '../../pages/Introduce.css'; 

const HowItWorks = () => {
  return (
    <section className="how-it-works section">
      <div className="container_home">
        <h2 className="section__title">Hoạt động như thế nào?</h2>
        <div className="how-it-works__container grid">
          <div className="step-item">
            <div className="step-item__icon"><i className='bx bx-search-alt'></i></div>
            <h3 className="step-item__title">1. Tìm kiếm</h3>
            <p className="step-item__description">Khám phá các ưu đãi đồ ăn ngon đang có sẵn xung quanh bạn.</p>
          </div>
          <div className="step-item">
            <div className="step-item__icon"><i className='bx bx-shopping-bag'></i></div>
            <h3 className="step-item__title">2. Đặt mua</h3>
            <p className="step-item__description">Chọn món bạn yêu thích và đặt mua trực tiếp trên website.</p>
          </div>
          <div className="step-item">
            <div className="step-item__icon"><i className='bx bx-store-alt'></i></div>
            <h3 className="step-item__title">3. Nhận hàng</h3>
            <p className="step-item__description">Đến cửa hàng, thanh toán và thưởng thức bữa ăn tuyệt vời của bạn.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;