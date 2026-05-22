import React from 'react';
import '../../pages/Introduce.css'; 
import { Link } from 'react-router-dom'; 

const PartnerCTA = () => {
  return (
    <section className="partner-cta section">
      <div className="container_home partner-cta__container">
        <h2 className="partner-cta__title">Bạn là chủ cửa hàng, tiệm bánh?</h2>
        <p className="partner-cta__description">Cùng chúng tôi giảm lãng phí, bảo vệ môi trường và tiếp cận hàng ngàn khách hàng mới.</p>
        <Link to="/partner" className="btn_home btn--light">Trở thành đối tác</Link>
      </div>
    </section>
  );
};

export default PartnerCTA;