// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GearShop from "./pages/shop/gearshop";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/shop/ProductDetail";
import Homepage from "./pages/Homepage";
//Booking page
import Booking from "./pages/Booking";
import PetHotel from "./pages/Booking/petHotel";
import PetEvent from "./pages/Booking/petEvent";
import PetSpa from "./pages/Booking/petSpa";
import PetVet from "./pages/Booking/petVet";
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
          <Route path="/" element={<Homepage />} />
          <Route path="/gearshop" element={<GearShop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/pethotel" element={<PetHotel />} />
          <Route path="/petevent" element={<PetEvent />} />
          <Route path="/petspa" element={<PetSpa />} />
          <Route path="/petvet" element={<PetVet />} />
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
