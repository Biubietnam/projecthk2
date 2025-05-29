// App.jsx
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GearShop from "./pages/shop/Gear/gearshop";
import Contact from "./pages/Contact";
import GearDetail from "./pages/shop/Gear/GearDetail";
import Homepage from "./pages/Homepage";
import Cart from "./pages/cart/Cart";
import Receipt from "./pages/cart/Receipt";
import ThankYou from "./pages/cart/thank-you";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


//Dat: Booking page
import Booking from "./pages/Booking";
import PetUnLogin from "./pages/Booking/petUnLogin";
import PetListForBooking from "./pages/Booking/petListForBooking";
import PetSpa from "./pages/Booking/petSpa";
import PetVet from "./pages/Booking/petVet";
import AddPetModal from "./pages/Booking/AddPetModal";
import MyBooking from "./pages/Booking/MyBooking";
import MyPets from "./pages/Booking/MyPets";

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
import EditProfile from "./pages/Admin/User/EditProfile";
import OrderManagement from "./pages/Admin/Order/OrderManagement";
import AdoptionManagement from "./pages/Admin/Adoption/AdoptionManagement";
import FeedbackManagement from "./pages/Admin/Feedback/FeedbackManagement";
import ContactManagement from "./pages/Admin/Contact/ContactManagement";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <div
      className={`App font-montserrat min-h-screen ${isAdmin
          ? "bg-gray-100"
          : "bg-gray-100 bg-pet-pattern bg-repeat bg-[length:50px_auto]"
        }`}
    >
      <ScrollToTop />
      {!isAdmin && <Header />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/*" element={<Homepage />} />
        <Route path="/gearshop" element={<GearShop />} />
        <Route path="/gear/:id" element={<GearDetail />} />
        <Route path="/petshop" element={<OurPets />} />
        <Route path="/pet/:id" element={<PetAdoptionPage />} />
        {/* Part Booking: Dat*/}
        <Route path="/mypets" element={<MyPets />} />
        <Route path="/mybooking" element={<MyBooking />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/petspa" element={<PetSpa />} />
        <Route path="/petvet" element={<PetVet />} />
        <Route path="/petUnLogin" element={<PetUnLogin />} />
        <Route path="/petlist" element={<PetListForBooking />} />

        <Route path="/petlist" element={<PetListForBooking />} />
        <Route path="/petunlogin" element={<PetUnLogin />} />
        <Route path="/addpetmodal" element={<AddPetModal />} />
        <Route path="/contact" element={<Contact />} />
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
        <Route path="/admin/users/edit/profile/:id" element={<EditProfile />} />
        <Route path="/admin/ordermanagement" element={<OrderManagement />} />
        <Route path="/admin/adoptionmanagement" element={<AdoptionManagement />} />
        <Route path="/admin/feedbackmanagement" element={<FeedbackManagement />} />
        <Route path="/admin/contactmanagement" element={<ContactManagement />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout/result" element={<Receipt />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  );
}
