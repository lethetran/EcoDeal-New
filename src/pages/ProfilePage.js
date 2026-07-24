// src/pages/ProfilePage/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styles from './ProfilePage.module.css';
import { FaUserEdit, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt, FaStore } from 'react-icons/fa';
import UserInfo from '../components/ProfilePage/UserInfo';
import OrderHistory from '../components/ProfilePage/OrderHistory';
import SavedAddresses from '../components/ProfilePage/SavedAddresses';
import MyDeals from '../components/ProfilePage/MyDeals';
import Header from '../components/Header/Header'; 
import Footer from '../components/Footer/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import { logout } from '../services/authService';

const ProfilePage = () => {
    // useLocation để AnimatePresence biết khi nào route thay đổi
    const location = useLocation();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const displayName = (currentUser?.displayName || '').trim();
    const email = currentUser?.email || '';
    const greetingName = displayName || (email ? email.split('@')[0] : 'Khách');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/home');
        } catch (error) {
            alert('Không thể đăng xuất lúc này, vui lòng thử lại.');
        }
    };

    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <div className={styles.profileLayout}>
                    <aside className={styles.profileNav}>
                        <div className={styles.navHeader}>
                            <img src="https://i.pravatar.cc/100" alt="Avatar" className={styles.avatar} />
                            <h3 className={styles.userName}>{greetingName}</h3>
                            <p className={styles.userEmail}>{email || 'guest@ecodeal.local'}</p>
                        </div>
                        <nav className={styles.navLinks}>
                            <NavLink to="/profile" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                                <FaUserEdit />
                                <span>Thông tin cá nhân</span>
                            </NavLink>
                            <NavLink to="/profile/orders" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                                <FaBoxOpen />
                                <span>Lịch sử đơn hàng</span>
                            </NavLink>
                            <NavLink to="/profile/addresses" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                                <FaMapMarkerAlt />
                                <span>Địa chỉ đã lưu</span>
                            </NavLink>
                            <NavLink to="/profile/deals" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                                <FaStore />
                                <span>Bài đã đăng</span>
                            </NavLink>
                            <button className={`${styles.navLink} ${styles.logoutLink}`} onClick={handleLogout} type="button">
                                <FaSignOutAlt />
                                <span>Đăng xuất</span>
                            </button>
                        </nav>
                    </aside>

                    <main className={styles.profileContent}>
                        <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route index element={<UserInfo />} />
                                <Route path="orders" element={<OrderHistory />} />
                                <Route path="addresses" element={<SavedAddresses />} />
                                <Route path="deals" element={<MyDeals />} />
                            </Routes>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
            <Footer />
        </>
        
    );
};

export default ProfilePage;