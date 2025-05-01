// App.jsx
import { Routes, Route } from "react-router-dom";
import React from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GearShop from "./pages/shop/Gear/gearshop";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/shop/Gear/GearDetail";
import Homepage from "./pages/Homepage";

//Booking page
import Booking from "./pages/Booking";
import PetHotel from "./pages/Booking/petHotel";
import HotelBooking from "./pages/Booking/hotelBooking";

import PetSpa from "./pages/Booking/petSpa";
import PetVet from "./pages/Booking/petVet";
import ResetPasswordFormContent from "./pages/Login/ResetPassword";
import LoginFormContent from "./pages/Login/Login";
import ForgotPasswordFormContent from "./pages/Login/ForgotPassword";
import SignUpFormContent from "./pages/Login/SignUp";
import AdminDashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import OurPets from "./pages/shop/Pet/petshop";
import PetAdoptionPage from "./pages/shop/Pet/PetAdoptionPage";

export default function App() {
  return (
      <div className="App font-concert bg-gray-100 min-h-screen">
        <Header />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/gearshop" element={<GearShop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/pethotel" element={<PetHotel />} />
          <Route path="/hotelbooking" element={<HotelBooking />} />

          <Route path="/petspa" element={<PetSpa />} />
          <Route path="/petvet" element={<PetVet />} />
          <Route path="/reset/:token" element={<ResetPasswordFormContent />} />
          <Route path="/login" element={<LoginFormContent />} />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordFormContent />}
          />
          <Route path="/signup" element={<SignUpFormContent />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/petshop" element={<OurPets />} />
          <Route path="/pet/:id" element={<PetAdoptionPage />} />
        </Routes>
        <Footer />
      </div>
  );
}
