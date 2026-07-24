// src/AuthForm.js
import React, { useState } from 'react';
import './AuthForm.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { login, loginWithGoogle, register } from '../services/authService';
// import Navbar from './Navbar';


const AuthForm = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
    setFormMessage('');
    setFormError('');
  };
  const navigate = useNavigate(); 

  const getFirebaseErrorMessage = (error) => {
    const code = error?.code || '';
    if (code.includes('auth/invalid-credential')) return 'Email hoặc mật khẩu không đúng.';
    if (code.includes('auth/wrong-password')) return 'Email hoặc mật khẩu không đúng.';
    if (code.includes('auth/user-not-found')) return 'Tài khoản chưa tồn tại.';
    if (code.includes('auth/email-already-in-use')) return 'Email này đã được đăng ký.';
    if (code.includes('auth/weak-password')) return 'Mật khẩu cần tối thiểu 6 ký tự.';
    if (code.includes('auth/invalid-email')) return 'Email không hợp lệ.';
    return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormMessage('');
    setIsSubmitting(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      setFormMessage('Đăng nhập thành công. Đang chuyển trang...');
      navigate('/home');
    } catch (error) {
      setFormError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormMessage('');
    setIsSubmitting(true);
    try {
      await register(registerEmail.trim(), registerPassword, registerName.trim());
      setFormMessage('Tạo tài khoản thành công. Bạn đã được đăng nhập.');
      navigate('/home');
    } catch (error) {
      setFormError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError('');
    setFormMessage('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      setFormMessage('Đăng nhập Google thành công. Đang chuyển trang...');
      navigate('/home');
    } catch (error) {
      setFormError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };


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
                onSubmit={handleLoginSubmit}
              >
                <h1>Sign In</h1>
                <div className="input-box">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  <i className="bx bxs-user"></i>
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
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

                
                {formError && isLoginActive && <p className="auth-status auth-status--error">{formError}</p>}
                {formMessage && isLoginActive && <p className="auth-status auth-status--success">{formMessage}</p>}
                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Login'}
                </button>
                <p>or login with social platforms</p>
                <div className="social-icons">
                  <button type="button" className="social-button" onClick={handleGoogleLogin} disabled={isSubmitting} title="Đăng nhập với Google"><i className='bx bxl-google'></i></button>
                  <button type="button" className="social-button social-button--disabled" disabled title="Chưa hỗ trợ"><i className='bx bxl-facebook'></i></button>
                  <button type="button" className="social-button social-button--disabled" disabled title="Chưa hỗ trợ"><i className='bx bxl-github'></i></button>
                  <button type="button" className="social-button social-button--disabled" disabled title="Chưa hỗ trợ"><i className='bx bxl-linkedin'></i></button>
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
                onSubmit={handleRegisterSubmit}
              >
                <h1>Sign Up</h1>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                  <i className="bx bxs-user"></i>
                </div>
                <div className="input-box">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                  <i className="bx bxs-envelope"></i>
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <i className="bx bxs-lock-alt"></i>
                </div>
                {formError && !isLoginActive && <p className="auth-status auth-status--error">{formError}</p>}
                {formMessage && !isLoginActive && <p className="auth-status auth-status--success">{formMessage}</p>}
                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Register'}
                </button>
                <p>or register with social platforms</p>
                <div className="social-icons">
                  <button type="button" className="social-button" onClick={handleGoogleLogin} disabled={isSubmitting} title="Đăng nhập với Google"><i className='bx bxl-google'></i></button>
                  <button type="button" className="social-button social-button--disabled" disabled title="Chưa hỗ trợ"><i className='bx bxl-facebook'></i></button>
                  <button type="button" className="social-button social-button--disabled" disabled title="Chưa hỗ trợ"><i className='bx bxl-github'></i></button>
                  <button type="button" className="social-button social-button--disabled" disabled title="Chưa hỗ trợ"><i className='bx bxl-linkedin'></i></button>
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
