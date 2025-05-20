// App.jsx
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GearShop from "./pages/shop/Gear/gearshop";
import Contact from "./pages/Contact";
import GearDetail from "./pages/shop/Gear/GearDetail";
import Homepage from "./pages/Homepage";
import Cart from "./pages/cart/Cart";

//Dat: Booking page
import Booking from "./pages/Booking";
import PetUnLogin from "./pages/Booking/petUnLogin";
import PetListForBooking from "./pages/Booking/petListForBooking";
import PetSpa from "./pages/Booking/petSpa";
import PetVet from "./pages/Booking/petVet";
import ServiceBooking from "./pages/Booking/serviceBooking";

// Part Thuc User
import ResetPasswordFormContent from "./pages/Login/ResetPassword";
import LoginFormContent from "./pages/Login/Login";
import ForgotPasswordFormContent from "./pages/Login/ForgotPassword";
import SignUpFormContent from "./pages/Login/SignUp";
import AdminDashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/User/UserManagement";
import PetManagement from "./pages/Admin/Pet/PetManagement";
import OurPets from "./pages/shop/Pet/petshop";
import PetAdoptionPage from "./pages/shop/Pet/PetAdoptionPage";
import GearManagement from "./pages/Admin/Gear/GearManagement";
import Checkout from "./pages/cart/Checkout";
import Profile from "./pages/User/Profile";
import EditPet from "./pages/Admin/Pet/EditPet";
import EditGear from "./pages/Admin/Gear/EditGear";
import EditUser from "./pages/Admin/User/EditUser";
import CreatePet from "./pages/Admin/Pet/CreatePet";
import CreateGear from "./pages/Admin/Gear/CreateGear";
import CreateUser from "./pages/Admin/User/CreateUser";

export default function App() {
  return (
    <div className="App font-concert bg-gray-100 min-h-screen">
      <Header />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/gearshop" element={<GearShop />} />
        <Route path="/gear/:id" element={<GearDetail />} />
        <Route path="/petshop" element={<OurPets />} />
        <Route path="/pet/:id" element={<PetAdoptionPage />} />
        {/* Part Booking: Dat*/}
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/booking" element={<Booking />} />
        <Route path="/petspa" element={<PetSpa />} />
        <Route path="/petvet" element={<PetVet />} />
        <Route path="/petUnLogin" element={<PetUnLogin />} />
        <Route path="/petlist" element={<PetListForBooking />} />
        <Route path="/serviceBooking" element={<ServiceBooking />} />

        <Route path="/petlist" element={<PetListForBooking />} />
        <Route path="/petunlogin" element={<PetUnLogin />} />

        <Route path="/reset/:token" element={<ResetPasswordFormContent />} />
        <Route path="/login" element={<LoginFormContent />} />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordFormContent />}
        />
        <Route path="/signup" element={<SignUpFormContent />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/usermanagement" element={<UserManagement />} />
        <Route path="/admin/petmanagement" element={<PetManagement />} />
        <Route path="/admin/gearmanagement" element={<GearManagement />} />
        <Route path="/admin/pets/edit/:id" element={<EditPet />} />
        <Route path="/admin/gears/edit/:id" element={<EditGear />} />
        <Route path="/admin/users/edit/:id" element={<EditUser />} />
        <Route path="/admin/pets/create" element={<CreatePet />} />
        <Route path="/admin/gears/create" element={<CreateGear />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  );
}
