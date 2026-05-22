// src/components/PageHeader/PageHeader.jsx
import React from 'react';
import styles from './PageHeader.module.css';

const PageHeader = ({ title, subtitle }) => (
    <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
);

export default PageHeader;