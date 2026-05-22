// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css'; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendCode = (e) => {
    e.preventDefault();
    alert(`Verification code has been sent to ${email}`);
    // viết API gửi email ở đây
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleSendCode}>
        <h1>Forgot Password</h1>
        <p>Please enter your email to receive the verification code. Check your email!</p>
        <div className="input-box">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <i className="bx bxs-envelope"></i>
        </div>

        <button type="submit" className="btn">Send Verification Code</button>
        <p className="back-link" onClick={() => navigate(-1)}>
  Back to Login
</p>

        {/* <p style={{ marginTop: '20px', cursor: 'pointer', color: '#333' }} onClick={() => navigate(-1)}>Back to Login</p> */}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
