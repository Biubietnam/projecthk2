//function to get the pet join if the user is not logged in
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
function PetUnLogin() {
  // DÙng navigate để điều hướng đến các trang khác
  const navigate = useNavigate();
  const handleBookingClick = () => {
    navigate("/login", { state: { redirectTo: "/petlist" } });
  };
  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto`}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid xl:grid-cols-2 grid-cols-1 gap-8 justify-items-center mt-20 px-4"
      >
        {/* Hình minh họa */}
        <img
          src="/img/booking/membershipPetZone.png"
          alt="Login Required"
          className="w-[260px] sm:w-[300px] md:w-[400px] lg:w-[320px] h-auto"
        />

        {/* Nội dung lời chào và nút */}
        <div className="text-center flex flex-col justify-center items-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#6D7AB5] mb-4">
            Welcome to PetZone!
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-700 max-w-md">
            To continue with your booking or manage your pet’s profile, please{" "}
            <span className="font-medium text-[#6D7AB5]">log in</span> or{" "}
            <span className="font-medium text-[#6D7AB5]">
              create a new account
            </span>
            .
            <br className="hidden sm:block" />
            We’re delighted to accompany you in caring for your beloved furry
            friends — because they deserve the very best! 🐾
          </p>

          <button
            className="mt-6 bg-[#6D7AB5] text-white px-6 py-2 rounded-lg hover:bg-[#5a649f] transition-all duration-300 shadow-md hover:shadow-lg text-base font-medium"
            onClick={() => {
              handleBookingClick();
              window.scrollTo(0, 0);
            }}
          >
            🐾 Login to Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
export default PetUnLogin;
