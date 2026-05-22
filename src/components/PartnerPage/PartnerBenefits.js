import React from 'react';
import '../../pages/PartnerPage.css'; 

function PartnerBenefits() {
  return (
    <section className="partner-benefits section">
      <div className="container">
        <h2 className="section__title">Lợi ích khi trở thành đối tác</h2>
        <div className="benefits__grid">
          <div className="benefit-card">
            <i className='bx bxs-dollar-circle benefit-card__icon'></i>
            <h3 className="benefit-card__title">Tăng doanh thu</h3>
            <p className="benefit-card__text">Tận dụng nguồn thực phẩm sắp hết hạn để tạo ra doanh thu thay vì lãng phí.</p>
          </div>
          <div className="benefit-card">
            <i className='bx bxs-group benefit-card__icon'></i>
            <h3 className="benefit-card__title">Khách hàng mới</h3>
            <p className="benefit-card__text">Tiếp cận cộng đồng người dùng lớn của PheniFood, những người quan tâm đến việc tiết kiệm.</p>
          </div>
          <div className="benefit-card">
            <i className='bx bxs-leaf benefit-card__icon'></i>
            <h3 className="benefit-card__title">Bảo vệ môi trường</h3>
            <p className="benefit-card__text">Chung tay giảm thiểu lãng phí thực phẩm, xây dựng hình ảnh thương hiệu bền vững.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnerBenefits;