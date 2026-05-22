// src/AuthForm.js
import React, { useState } from 'react';
import './AuthForm.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';


const AuthForm = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };
  const navigate = useNavigate(); 


  return (
    <div className="auth-wrapper">
      {/* <Navbar /> */}
      <div className={`container ${isLoginActive ? '' : 'active'}`}>
        <div className="form-box login">
          <AnimatePresence mode="wait">
            {isLoginActive && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <h1>Sign In</h1>
                <div className="input-box">
                  <input type="text" placeholder="Username" required />
                  <i className="bx bxs-user"></i>
                </div>
                <div className="input-box">
                  <input type="password" placeholder="Password" required />
                  <i className="bx bxs-lock-alt"></i>
                </div>
                {/* <div className="forgot-link">
                  <button className="forgot-link" onClick={() => {}} style={{ all: 'unset', cursor: 'pointer' }}>Forgot Password?</button>
                </div> */}
                <div className="forgot-link">
                    <button 
                        className="forgot-link" 
                        onClick={() => navigate('/forgot-password')} 
                        style={{ all: 'unset', cursor: 'pointer' }}
                    >
                        Forgot Password?
                    </button>
                </div>

                
                <button type="submit" className="btn">Login</button>
                <p>or login with social platforms</p>
                <div className="social-icons">
                  <button type="button" className="social-button"><i className='bx bxl-google'></i></button>
                  <button type="button" className="social-button"><i className='bx bxl-facebook'></i></button>
                  <button type="button" className="social-button"><i className='bx bxl-github'></i></button>
                  <button type="button" className="social-button"><i className='bx bxl-linkedin'></i></button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="form-box register">
          <AnimatePresence mode="wait">
            {!isLoginActive && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <h1>Sign Up</h1>
                <div className="input-box">
                  <input type="text" placeholder="Username" required />
                  <i className="bx bxs-user"></i>
                </div>
                <div className="input-box">
                  <input type="email" placeholder="Email" required />
                  <i className="bx bxs-envelope"></i>
                </div>
                <div className="input-box">
                  <input type="password" placeholder="Password" required />
                  <i className="bx bxs-lock-alt"></i>
                </div>
                <button type="submit" className="btn">Register</button>
                <p>or register with social platforms</p>
                <div className="social-icons">
                  <button type="button" className="social-button"><i className='bx bxl-google'></i></button>
                  <button type="button" className="social-button"><i className='bx bxl-facebook'></i></button>
                  <button type="button" className="social-button"><i className='bx bxl-github'></i></button>
                  <button type="button" className="social-button"><i className='bx bxl-linkedin'></i></button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn" onClick={toggleForm}>Register</button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn" onClick={toggleForm}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
