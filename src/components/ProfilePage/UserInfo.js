import React from 'react';
import { motion } from 'framer-motion';
import styles from './ProfileContent.module.css';
import Card from '../CartPage/Card';

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const UserInfo = () => (
    <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
    >
        <Card>
            <h2 className={styles.contentTitle}>Thông tin cá nhân</h2>
            <div className={styles.contentBody}>
                <p>Chức năng này đang được phát triển.</p>
            </div>
        </Card>
    </motion.div>
);

export default UserInfo;