// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GearShop from "./pages/shop/GearShop";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/shop/ProductDetail";
import ResetPasswordFormContent from "./pages/Login/ResetPassword";
import LoginFormContent from "./pages/Login/Login";
import ForgotPasswordFormContent from "./pages/Login/ForgotPassword";
import SignUpFormContent from "./pages/Login/SignUp";


export default function App() {

  return (
    <Router>
      <div className="App font-winky">
        <Header />

        <Routes>
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/gearshop" element={<GearShop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/reset/:token" element={<ResetPasswordFormContent />} />
          <Route path="/login" element={<LoginFormContent />} />
          <Route path="/forgot-password" element={<ForgotPasswordFormContent />} />
          <Route path="/signup" element={<SignUpFormContent />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
