// src/components/QuantitySelector/QuantitySelector.jsx
import React from 'react';
import styles from './QuantitySelector.module.css';
import { FaPlus, FaMinus } from 'react-icons/fa';

const QuantitySelector = ({ quantity, onIncrease, onDecrease }) => {
    return (
        <div className={styles.selector}>
            <button onClick={onDecrease} className={styles.button} disabled={quantity <= 1}>
                <FaMinus />
            </button>
            <span className={styles.quantity}>{quantity}</span>
            <button onClick={onIncrease} className={styles.button}>
                <FaPlus />
            </button>
        </div>
    );
};
export default QuantitySelector;