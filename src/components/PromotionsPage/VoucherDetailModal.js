// import React from 'react';
// import { motion } from 'framer-motion';
// import styles from './VoucherDetailModal.module.css';
// import { FaTimes, FaCopy, FaCheck } from 'react-icons/fa';

// const backdropVariants = {
//     visible: { opacity: 1 },
//     hidden: { opacity: 0 },
// };

// const modalVariants = {
//     hidden: { y: "100vh", opacity: 0, scale: 0.7 },
//     visible: { y: "0", opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } },
//     exit: { y: "100vh", opacity: 0, scale: 0.7, transition: { duration: 0.3 } },
// };

// const VoucherDetailModal = ({ voucher, onClose, onSave }) => {
//     const [copied, setCopied] = React.useState(false);

//     const handleCopy = () => {
//         navigator.clipboard.writeText(voucher.code);
//         if (onSave) {
//             onSave(voucher.code);
//         }
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };

//     return (
//         <motion.div
//             className={styles.backdrop}
//             variants={backdropVariants}
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//             onClick={onClose}
//         >
//             <motion.div
//                 className={styles.modal}
//                 variants={modalVariants}
//                 onClick={(e) => e.stopPropagation()} // Ngăn click vào modal làm đóng modal
//             >
//                 <button className={styles.closeButton} onClick={onClose}><FaTimes /></button>
//                 <div className={styles.modalHeader}>
//                     <img src={voucher.type === 'product' ? voucher.imageUrl : voucher.logoUrl} alt={voucher.title} />
//                 </div>
//                 <div className={styles.modalContent}>
//                     <h2>{voucher.title}</h2>
//                     <p>{voucher.desc}</p>
//                     <div className={styles.codeSection}>
//                         <span className={styles.codeText}>{voucher.code}</span>
//                         <button onClick={handleCopy} className={styles.copyButton}>
//                             {/* Logic hiển thị đã lưu giờ sẽ do component cha quyết định,
//                                 nhưng chúng ta vẫn có thể hiển thị trạng thái "Đã chép" tạm thời */}
//                             {copied ? <FaCheck /> : <FaCopy />}
//                             {copied ? 'Đã chép' : 'Sao chép'}
//                         </button>
//                     </div>
//                     <div className={styles.termsSection}>
//                         <h4>Điều khoản & Điều kiện</h4>
//                         <p>{voucher.terms}</p>
//                         <p>Hạn sử dụng: <strong>{voucher.expiry}</strong></p>
//                     </div>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// };

// export default VoucherDetailModal;
import React from 'react';
import { motion } from 'framer-motion';
import styles from './VoucherDetailModal.module.css';
import { FaTimes, FaCopy, FaCheck } from 'react-icons/fa';

const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};
const modalVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
    exit: { y: 50, opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const VoucherDetailModal = ({ voucher, onClose }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(voucher.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div className={styles.backdrop} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
            <motion.div className={styles.modal} variants={modalVariants} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalGrid}>
                    <div className={styles.modalImage}>
                        <img src={voucher.type === 'product' ? voucher.imageUrl : voucher.logoUrl} alt={voucher.title} />
                    </div>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={onClose}><FaTimes /></button>
                        <h2>{voucher.title}</h2>
                        <p className={styles.desc}>{voucher.desc}</p>
                        
                        <div className={styles.codeSection}>
                            <span className={styles.codeText}>{voucher.code}</span>
                            <button onClick={handleCopy} className={`${styles.copyButton} ${copied ? styles.copied : ''}`}>
                                {copied ? <FaCheck /> : <FaCopy />}
                                {copied ? 'Đã chép!' : 'Sao chép'}
                            </button>
                        </div>

                        <div className={styles.termsSection}>
                            <h4>Điều khoản & Điều kiện</h4>
                            <p>{voucher.terms}</p>
                            <p>Hạn sử dụng: <strong>{voucher.expiry}</strong></p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
export default VoucherDetailModal;