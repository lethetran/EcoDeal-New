import React from 'react';
import '../../pages/Introduce.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container container_home grid">
        <div>
          <a href="/logo" className="footer__logo">ECODEAL</a>
          <p className="footer__description">Giải cứu đồ ăn, tiết kiệm tiền, <br/> bảo vệ hành tinh.</p>
        </div>
        <div className="footer__content">
          <div>
            <h3 className="footer__title">Về chúng tôi</h3>
            <ul className="footer__links">
               <li><a href="/nhiem-vu" className="footer__link">Nhiệm vụ</a></li>
               <li><a href="/bao-chi" className="footer__link">Báo chí</a></li>
               <li><a href="/tuyen-dung" className="footer__link">Tuyển dụng</a></li>


            </ul>
          </div>
          <div>
            <h3 className="footer__title">Hỗ trợ</h3>
            <ul className="footer__links">
              <li><a href="/faq" className="footer__link">Câu hỏi thường gặp</a></li>
              <li><a href="/contact" className="footer__link">Liên hệ</a></li>
              <li><a href="/terms" className="footer__link">Điều khoản dịch vụ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="footer__title">Mạng xã hội</h3>
            <div className="footer__social">
              <a href="https://facebook.com" className="footer__social-link"><i className='bx bxl-facebook-circle'></i></a>
              <a href="https://instagram.com" className="footer__social-link"><i className='bx bxl-instagram-alt'></i></a>
              <a href="https://twitter.com" className="footer__social-link"><i className='bx bxl-twitter'></i></a>
            </div>
          </div>
        </div>
      </div>
      <p className="footer__copy">&#169; 2025 ECODEAL. All rights reserved.</p>
    </footer>
  );
};

export default Footer;