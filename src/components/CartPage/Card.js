// src/components/Card/Card.jsx

import React from 'react';
import styles from './Card.module.css';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children 
 * @param {string} [props.className] 
 */
const Card = ({ children, className }) => {
    const cardClassName = `${styles.card} ${className || ''}`;

    return (
        <div className={cardClassName}>
            {children}
        </div>
    );
};

export default Card;