// src/components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import './Header.css'; // Đảm bảo bạn đã import file CSS
import useWindowSize from '../../hooks/useWindowSize'; // Import hook useWindowSize
import ScanImage from '../ScanImage/ScanImage';
import PostProduct from '../PostProduct/PostProduct';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { logout } from '../../services/authService';
import { useCart } from '../../hooks/useCart';
const Header = () => {
    // 1. State để quản lý việc dropdown đang mở hay đóng
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const { cartItemCount } = useCart();
    const navigate = useNavigate();

    // 2. Ref để tham chiếu đến DOM element của user-area
    const dropdownRef = useRef(null);

    // Hàm để bật/tắt dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
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
            setIsDropdownOpen(false);
            navigate('/home');
        } catch (error) {
            alert('Không thể đăng xuất lúc này, vui lòng thử lại.');
        }
    };

    const { width } = useWindowSize();
  const isMobile = width <= 768; // Đặt ngưỡng cho mobile là 768px

    // 3. useEffect để xử lý việc click ra ngoài thì đóng dropdown
    useEffect(() => {
        // Hàm xử lý khi click chuột
        const handleClickOutside = (event) => {
            // Nếu ref đã tồn tại và điểm click không nằm trong element của ref
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // Đóng dropdown
            }
        };

        // Thêm event listener khi component được mount
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup: gỡ bỏ event listener khi component bị unmount để tránh rò rỉ bộ nhớ
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Mảng rỗng đảm bảo effect này chỉ chạy 1 lần khi mount
    if (isMobile) {
        return (
            <div className="mobile-tab-bar">
                <a href="/home" className="logo-mobile">
                    {/* Bạn có thể dùng logo dạng icon ở đây */}
                    P
                </a>
                <div className="tab-bar__links">
                    <a href="/home" className="tab-bar__link active">
                        <i className='bx bx-home-alt'></i>
                        <span>Trang Chủ</span>
                    </a>
                    <a href="/promotions" className="tab-bar__link">
                        <i className='bx bxs-hot'></i>
                        <span>Ưu Đãi</span>
                    </a>
                    <button 
                        className="tab-bar__link camera-link"
                        onClick={() => setIsScanModalOpen(true)}
                        style={{background: 'none', border: 'none', cursor: 'pointer'}}
                    >
                        <i className='bx bx-camera'></i>
                        <span>Quét</span>
                    </button>
                    <a href="/stores" className="tab-bar__link">
                        <i className='bx bx-store-alt'></i>
                        <span>Nhà Hàng</span>
                    </a>
                    <a href="/cart" className="tab-bar__link">
                        <i className='bx bx-cart'></i>
                        <span>Giỏ hàng</span>
                    </a>
                </div>
                <div className="tab-bar__profile">
                    <img 
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                        alt="User Avatar" 
                        className="user-area__avatar" 
                    />
                </div>
                {isScanModalOpen && <ScanImage onClose={() => setIsScanModalOpen(false)} />}
            </div>
        );
    }

    return (
        <>
        <div className={`app-wrapper ${isMobile ? 'has-mobile-sidebar' : ''}`}>
        <header className="navbar">
            <a href="/home" className="logo">ECODEAL</a>
            <nav>
                <a href="/home">Trang Chủ</a>
                <a href="/promotions">Ưu Đãi</a>
                <a href="/stores">Nhà Hàng</a>
                <a href="#explore">Khám Phá</a>
            </nav>
            
            <div className="nav__actions">
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

                {/* Gán ref vào đây */}
                <div className="user-area" ref={dropdownRef}>
                    <div className="user-area__trigger" onClick={toggleDropdown} style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" className="user-area__avatar" />
                        <span className="user-area__greeting">{currentUser ? `Chào ${currentUser.displayName || currentUser.email}!` : 'Xin chào'}</span>
                    </div>
                    
                    {/* Dùng state để thêm/xóa class 'active' */}
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
                                <li>
                                    <Link to="/login"><i className='bx bx-log-in'></i> Đăng nhập / Đăng ký</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        </div>
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
        </>
    );
};

export default Header;