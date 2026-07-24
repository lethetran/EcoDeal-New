import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './ProfileContent.module.css';
import Card from '../CartPage/Card';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const UserInfo = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const displayName = (currentUser?.displayName || '').trim();
    const email = currentUser?.email || 'Chưa có email';
    const userId = currentUser?.uid || 'Guest';
    const providerId = currentUser?.providerData?.[0]?.providerId || 'anonymous';
    const joinedAt = currentUser?.metadata?.creationTime
        ? new Date(currentUser.metadata.creationTime).toLocaleString('vi-VN')
        : 'Chưa xác định';

    return (
        <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Card>
                <h2 className={styles.contentTitle}>Thông tin cá nhân</h2>
                <div className={styles.contentBody}>
                    <div className={styles.profileInfoGrid}>
                        <div className={styles.profileInfoRow}>
                            <span>Họ tên</span>
                            <strong>{displayName || 'Khách'}</strong>
                        </div>
                        <div className={styles.profileInfoRow}>
                            <span>Email</span>
                            <strong>{email}</strong>
                        </div>
                        <div className={styles.profileInfoRow}>
                            <span>ID người dùng</span>
                            <strong>{userId}</strong>
                        </div>
                        <div className={styles.profileInfoRow}>
                            <span>Đăng nhập bằng</span>
                            <strong>{providerId}</strong>
                        </div>
                        <div className={styles.profileInfoRow}>
                            <span>Ngày tạo tài khoản</span>
                            <strong>{joinedAt}</strong>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default UserInfo;