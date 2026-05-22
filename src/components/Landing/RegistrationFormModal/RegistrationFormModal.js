import React from 'react';
import { motion } from 'framer-motion';
import styles from './RegistrationFormModal.module.css'; // Import CSS
import { FaTimes } from 'react-icons/fa';

// Định nghĩa các hiệu ứng cho nền mờ và khung modal
const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};

const modalVariants = {
    hidden: { y: "-50vh", opacity: 0 },
    visible: { 
        y: "0", 
        opacity: 1, 
        transition: { type: 'spring', stiffness: 150, damping: 25 } 
    },
    exit: { y: "100vh", opacity: 0 },
};

const RegistrationFormModal = ({ onClose }) => {
    // Hàm này ngăn việc click vào form cũng làm đóng Modal
    const handleModalClick = (e) => e.stopPropagation();

    return (
        // 1. Lớp nền mờ bao phủ toàn màn hình
        <motion.div
            className={styles.backdrop}
            onClick={onClose} // Khi click vào nền mờ, gọi hàm onClose để đóng
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            {/* 2. Khung nội dung của Modal */}
            <motion.div
                className={styles.modalContent}
                onClick={handleModalClick} // Ngăn sự kiện click lan ra lớp nền
                variants={modalVariants}
                // initial, animate, exit đã được định nghĩa trong variants
            >
                {/* 3. Nút đóng Modal */}
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes />
                </button>

                {/* 4. Nội dung chính của Form */}
                <div className={styles.formHeader}>
                    <h2>Đăng Ký Đối Tác</h2>
                    <p>Cùng PheniFood đưa thương hiệu của bạn đến với hàng triệu khách hàng!</p>
                </div>

                {/* Cậu có thể thay thế bằng component Form hoàn chỉnh của mình */}
                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="storeName">Tên cửa hàng</label>
                        <input type="text" id="storeName" placeholder="Ví dụ: Cơm Tấm Ba Ghiền" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email liên hệ</label>
                        <input type="email" id="email" placeholder="email@congty.com" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Số điện thoại</label>
                        <input type="tel" id="phone" placeholder="090xxxxxxx" />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Gửi Thông Tin
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default RegistrationFormModal;