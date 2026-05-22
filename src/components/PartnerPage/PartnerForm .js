import React, { useState } from 'react';
import '../../pages/PartnerPage.css'; 

function PartnerForm() {
    const [formData, setFormData] = useState({
        storeName: '',
        category: '',
        address: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu form đã gửi:", formData);
        alert("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
    };

    return (
        <section id="register-form" className="partner-form-section section">
            <div className="container">
                <div className="form-container">
                    <div className="form-header">
                        <h2 className="form-title">ĐĂNG KÝ HỢP TÁC</h2>
                        <p className="form-subtitle">Hoàn thành biểu mẫu dưới đây, đội ngũ PheniFood sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="partner-form">
                        <div className="form-group">
                            <label htmlFor="store-name">Tên cửa hàng / Thương hiệu</label>
                            <input type="text" id="store-name" name="storeName" placeholder="Ví dụ: Tiệm bánh ABC" required value={formData.storeName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Loại hình kinh doanh</label>
                            <select id="category" name="category" required value={formData.category} onChange={handleChange}>
                                <option value="" disabled>-- Chọn loại hình --</option>
                                <option value="restaurant">Nhà hàng / Quán ăn</option>
                                <option value="bakery">Tiệm bánh</option>
                                <option value="cafe">Quán cà phê / Trà sữa</option>
                                <option value="supermarket">Siêu thị / Cửa hàng tiện lợi</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ kinh doanh</label>
                            <input type="text" id="address" name="address" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" required value={formData.address} onChange={handleChange} />
                        </div>
                        <hr className="form-divider" />
                        <p className="form-section-title">Thông tin người liên hệ</p>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contact-name">Họ và Tên</label>
                                <input type="text" id="contact-name" name="contactName" placeholder="Nguyễn Văn An" required value={formData.contactName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-phone">Số điện thoại</label>
                                <input type="tel" id="contact-phone" name="contactPhone" placeholder="09xxxxxxxx" required value={formData.contactPhone} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-email">Email</label>
                            <input type="email" id="contact-email" name="contactEmail" placeholder="email@example.com" required value={formData.contactEmail} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn--primary btn--large">Gửi thông tin</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default PartnerForm;