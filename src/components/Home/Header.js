// src/components/Header.js
import React, { useState, useRef } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside'; // Import custom hook
import '../../pages/Home.css'; 
// Component Header sẽ nhận một prop là hàm `onSearchClick` từ component cha
function Header({ onSearchClick }) {
  
  // 1. Dùng useState để quản lý trạng thái đóng/mở của dropdown người dùng
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // 2. Dùng useRef để tham chiếu đến div của dropdown
  const dropdownRef = useRef(null);

  // 3. Dùng custom hook: Nếu click ra ngoài vùng dropdownRef, hãy đóng nó lại
  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

  // Hàm để bật/tắt dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <nav className="nav container">
        <a href="/" className="nav__logo">PheniFood</a>

        {/* Khi click vào thanh search này cũng sẽ mở overlay */}
        <div className="nav__search" onClick={onSearchClick}>
          <i className='bx bx-search'></i>
          <input type="text" placeholder="Tìm kiếm món ăn, cửa hàng..." readOnly />
        </div>

        <div className="nav__actions">
          {/* Icon search trên mobile */}
          <button id="search-open-btn" className="nav__action-link " onClick={onSearchClick}>
            <i className='bx bx-search'></i>
          </button>
      
          <a href="/cart" className="nav__action-link cart-link">
            <i className='bx bx-cart'></i>
            <span className="cart-badge">2</span>
          </a>

          <a href="/notifications" className="nav__action-link">
            <i className='bx bx-bell'></i>
          </a>

          <div className="user-area" ref={dropdownRef}>
            <div className="user-area__trigger" onClick={toggleDropdown} style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" className="user-area__avatar" />
              <span className="user-area__greeting">Chào An!</span>
            </div>
            
            <div className={`user-area__dropdown ${isDropdownOpen ? 'active' : ''}`}>
              <ul className="dropdown__menu">
                <li><a href="/profile"><i className='bx bx-user'></i> Tài khoản của tôi</a></li>
                <li><a href="/orders"><i className='bx bx-receipt'></i> Đơn hàng của tôi</a></li>
                <li><a href="/saved-stores"><i className='bx bx-store-alt'></i> Cửa hàng đã lưu</a></li>
                <li className="dropdown__divider"></li>
                <li><button className="logout-button"><i className='bx bx-log-out'></i> Đăng xuất</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;