// src/App.js
import React from "react";
import 'boxicons/css/boxicons.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Introduce from "./pages/Introduce";
import PartnerPage from "./pages/PartnerPage";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/Product";
import CartPage from "./pages/CartPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import PromotionsPage from "./pages/PromotionsPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import PaymentQRPage from "./pages/PaymentQRPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import AboutPage from "./pages/AboutPage";
import StoresPage from "./pages/StoresPage"; // Import trang cửa hàng
import Landing from "./pages/Landing"; // Import trang giới thiệu
import CheckoutPage from "./pages/CheckoutPage";  

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<AboutPage />} /> */}
        {/* <Route path="/" element={<AuthForm/>} /> */}
        {/* <Route path="/" element={<CartPage />} /> */}
        {/* <Route path="/" element={<CheckoutPage />} /> */}
        {/* <Route path="/" element={<ForgotPasswordPage />} /> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<Introduce />} /> */}
        {/* <Route path="/" element={<Landing />} /> */}
        {/* <Route path="/" element={<OrderDetailPage />} /> */}
        {/* <Route path="/" element={<PartnerPage />} /> */}
        {/* <Route path="/" element={<PaymentQRPage />} /> */}
        {/* <Route path="/" element={<ProductDetailPage />} /> */}
        {/* <Route path="/" element={<ProfilePage />} /> */}
        {/* <Route path="/" element={<PromotionsPage />} /> */}
        {/* <Route path="/" element={<StoreDetailPage />} /> */}
        {/* <Route path="/" element={<StoresPage />} /> */}
        {/* <Route path="/" element={<ProductDetailPage />} /> */}
        {/* <Route path="/" element={<Header />} /> */}
        {/* <Route path="/" element={<Footer />} /> */}

        {/* Uncomment the routes below as needed */}

        

        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/profile/*" element={<ProfilePage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/store/:id" element={<StoreDetailPage />} />
        <Route path="/payment-qr" element={<PaymentQRPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/seller" element={<SellerDashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* <Route path="/cart" element={<CartPage />} /> */}
        {/* Thêm các route khác nếu cần */}
      </Routes>
    </Router>
  );
}

export default App;
