import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Hủy
                    </button>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;