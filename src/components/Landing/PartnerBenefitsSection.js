// src/components/landing/PartnerBenefitsSection.js

import React, { useState } from 'react'; // <-- BƯỚC 1: Import thêm useState
import { AnimatePresence } from 'framer-motion'; // <-- BƯỚC 2: Import AnimatePresence
import AnimateOnScroll from './AnimateOnScroll';
import styles from './PartnerBenefitsSection.module.css';
import RegistrationFormModal from '../../components/Landing/RegistrationFormModal/RegistrationFormModal'; // <-- BƯỚC 3: Import Modal. (Hãy chắc chắn đường dẫn này đúng với cấu trúc dự án của cậu)

// SVG Icons as React Components (Giữ nguyên)
const RevenueIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1H1V3zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/></svg>
);
const EnvironmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0 7.25 2.503 5.746 4.176 4.432 5.638C3.122 7.096 2 8.345 2 10a6 6 0 0 0 6 6zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>
);
const CustomerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 13.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0-2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0-2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3 4a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0-2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0-2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3 4a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0-2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0-2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/></svg>
);

const benefitsData = [
    { icon: <RevenueIcon />, title: "Tăng Thêm Doanh Thu", description: "Biến thực phẩm dư thừa cuối ngày thành một nguồn thu nhập mới. Không bỏ phí, không mất thêm chi phí." },
    { icon: <EnvironmentIcon />, title: "Bảo Vệ Môi Trường", description: "Chung tay xây dựng một mô hình kinh doanh bền vững, nâng cao hình ảnh thương hiệu có trách nhiệm." },
    { icon: <CustomerIcon />, title: "Tiếp Cận Khách Hàng Mới", description: "Thu hút một lượng lớn khách hàng mới quan tâm đến sản phẩm của bạn qua nền tảng PheniFood." },
];

const PartnerBenefitsSection = () => {
    // <-- BƯỚC 4: Thêm state và các hàm điều khiển modal -->
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        // Dùng Fragment <>...</> để bọc cả section và modal
        <>
            <section id="partner-benefits-section" className={styles.partnerBenefitsSection}>
                <AnimateOnScroll>
                    <h2>Đồng Hành Cùng PheniFood</h2>
                    <p className={styles.sectionSubtitle}>Tối ưu lợi nhuận, giảm lãng phí, và cùng chúng tôi tạo ra tác động tích cực.</p>
                </AnimateOnScroll>
                <div className={styles.benefitsGrid}>
                    {benefitsData.map((benefit, index) => (
                        <AnimateOnScroll key={index}>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}>{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
                <AnimateOnScroll>
                    <div className={styles.ctaButtons}>
                        {/* <-- BƯỚC 5: Gắn sự kiện onClick vào nút bấm --> */}
                        <button className={styles.btnPrimary} onClick={openModal}>
                            Đăng Ký Cho Cửa Hàng
                        </button>
                    </div>
                </AnimateOnScroll>
            </section>

            {/* <-- BƯỚC 6: Thêm logic để hiển thị Modal --> */}
            <AnimatePresence>
                {isModalOpen && <RegistrationFormModal onClose={closeModal} />}
            </AnimatePresence>
        </>
    );
};

export default PartnerBenefitsSection;