import React from 'react';
import styles from './VoucherModal.module.css';
import { FaTicketAlt, FaTimes } from 'react-icons/fa';

const VoucherModal = ({ isOpen, onClose, savedVouchers, onApply, subTotal, appliedVoucherId }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h3>Chọn Voucher</h3>
                    <button onClick={onClose} className={styles.closeButton}><FaTimes /></button>
                </header>
                <div className={styles.voucherList}>
                    {savedVouchers.map(voucher => {
                        const isApplicable = subTotal >= voucher.condition.minOrderValue;
                        const isApplied = voucher.id === appliedVoucherId;
                        return (
                            <div key={voucher.id} className={`${styles.voucherItem} ${!isApplicable ? styles.disabled : ''} ${isApplied ? styles.applied : ''}`}>
                                <div className={styles.iconWrapper}><FaTicketAlt /></div>
                                <div className={styles.voucherInfo}>
                                    <p className={styles.voucherCode}>{voucher.code}</p>
                                    <p className={styles.voucherDesc}>{voucher.description}</p>
                                </div>
                                {isApplicable && (
                                    <input type="radio" name="voucher" checked={isApplied} onChange={() => onApply(voucher.id)} className={styles.radioSelect} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;