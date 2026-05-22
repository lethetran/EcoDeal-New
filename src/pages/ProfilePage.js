// src/pages/ProfilePage/ProfilePage.jsx

import React from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './ProfilePage.module.css';
import { FaUserEdit, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import UserInfo from '../components/ProfilePage/UserInfo';
import OrderHistory from '../components/ProfilePage/OrderHistory';
import Header from '../components/Header/Header'; 
import Footer from '../components/Footer/Footer';

const ProfilePage = () => {
    // useLocation để AnimatePresence biết khi nào route thay đổi
    const location = useLocation();

    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <div className={styles.profileLayout}>
                    <aside className={styles.profileNav}>
                        <div className={styles.navHeader}>
                            <img src="https://i.pravatar.cc/100" alt="Avatar" className={styles.avatar} />
                            <h3 className={styles.userName}>Nguyễn Văn An</h3>
                            <p className={styles.userEmail}>an.nguyen@email.com</p>
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
                            <NavLink to="/logout" className={`${styles.navLink} ${styles.logoutLink}`}>
                                <FaSignOutAlt />
                                <span>Đăng xuất</span>
                            </NavLink>
                        </nav>
                    </aside>

                    <main className={styles.profileContent}>
                        <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route index element={<UserInfo />} />
                                <Route path="orders" element={<OrderHistory />} />
                                <Route path="addresses" element={<div>Địa chỉ đang phát triển</div>} />
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