// src/components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside'; // Import custom hook
import '../../pages/Home.css'; 
import ScanImage from '../ScanImage/ScanImage';
import PostProduct from '../PostProduct/PostProduct';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { logout } from '../../services/authService';
import { useCart } from '../../hooks/useCart';
// Component Header sẽ nhận một prop là hàm `onSearchClick` từ component cha
function Header({ onSearchClick }) {
  
  // 1. Dùng useState để quản lý trạng thái đóng/mở của dropdown người dùng
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  // 2. Dùng useRef để tham chiếu đến div của dropdown
  const dropdownRef = useRef(null);

  // 3. Dùng custom hook: Nếu click ra ngoài vùng dropdownRef, hãy đóng nó lại
  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

  // Hàm để bật/tắt dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenPostModal = () => {
    if (!currentUser) {
      alert('Bạn cần đăng nhập hoặc đăng ký để đăng bài.');
      navigate('/login');
      return;
    }
    setIsPostModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/home');
    } catch (error) {
      alert('Không thể đăng xuất lúc này, vui lòng thử lại.');
    }
  };

  return (
    <header className="header">
      <nav className="nav container">
        <a href="/" className="nav__logo">ECODEAL</a>

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

          <button 
            className="nav__action-link camera-link"
            onClick={() => setIsScanModalOpen(true)}
            title="Quét NSX/HSD"
          >
            <i className='bx bx-camera'></i>
          </button>

          <button
            className="nav__action-link post-link"
            onClick={handleOpenPostModal}
            title="Đăng sản phẩm"
          >
            <i className='bx bx-upload'></i>
          </button>
      
          <a href="/cart" className="nav__action-link cart-link">
            <i className='bx bx-cart'></i>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </a>

          <a href="/notifications" className="nav__action-link">
            <i className='bx bx-bell'></i>
          </a>

          <div className="user-area" ref={dropdownRef}>
            <div className="user-area__trigger" onClick={toggleDropdown} style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" className="user-area__avatar" />
              <span className="user-area__greeting">{currentUser ? `Chào ${currentUser.displayName || currentUser.email}!` : 'Xin chào'}</span>
            </div>
            
            <div className={`user-area__dropdown ${isDropdownOpen ? 'active' : ''}`}>
              <ul className="dropdown__menu">
                {currentUser ? (
                  <>
                    <li><a href="/profile"><i className='bx bx-user'></i> Tài khoản của tôi</a></li>
                    <li><a href="/profile/orders"><i className='bx bx-receipt'></i> Đơn hàng của tôi</a></li>
                    <li><a href="/saved-stores"><i className='bx bx-store-alt'></i> Cửa hàng đã lưu</a></li>
                    <li className="dropdown__divider"></li>
                    <li><button className="logout-button" onClick={handleLogout}><i className='bx bx-log-out'></i> Đăng xuất</button></li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login"><i className='bx bx-log-in'></i> Đăng nhập / Đăng ký</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {isScanModalOpen && (
        <ScanImage 
          onClose={() => setIsScanModalOpen(false)}
          onPostProduct={(data) => {
            setScannedData(data);
            setIsScanModalOpen(false);
            setIsPostModalOpen(true);
          }}
        />
      )}
      {isPostModalOpen && <PostProduct nsxData={scannedData} onClose={() => setIsPostModalOpen(false)} />}
    </header>
  );
}

export default Header;