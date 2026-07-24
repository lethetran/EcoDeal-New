import React from 'react';
import '../../pages/Introduce.css'; 
// import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  // const navigate = useNavigate();
  return (
    <header className="header">
      <nav className="nav container_home">
        <a href="/introduce" className="nav__logo">ECODEAL</a>
        <div className="nav__search">
          <i className='bx bx-search'></i>
          <input type="text" placeholder="Tìm kiếm món ăn, cửa hàng..." />
        </div>
        <div className="nav__menu">
          <ul className="nav__list">
            <li className="nav__item"><a href="/promotions" className="nav__link active">Ưu đãi hôm nay</a></li>
            <li className="nav__item"><a href="/stores" className="nav__link">Cửa hàng đối tác</a></li>
            <li className="nav__item"><a href="/about" className="nav__link">Về chúng tôi</a></li>
          </ul>
        </div>
        <div className="nav__actions">
          <a href="/login" className="btn_home btn--outline">Đăng nhập</a>
          <a href="/register" className="btn_home btn--primary">Đăng ký</a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;