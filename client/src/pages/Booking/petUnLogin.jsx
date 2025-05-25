//function to get the pet join if the user is not logged in
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

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
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-xl w-full">
        <img
          src="/img/illustrations/login-required.png" // Thay bằng hình minh họa phù hợp nếu có
          alt="Login Required"
          className="w-32 h-32 mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold text-[#6D7AB5] mb-4">
          Welcome to PetZone!
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          To join or manage your pets, please login to your account. Let’s take
          care of your furry friends together!
        </p>
        <Button
          onClick={() => {
            handleBookingClick();
            window.scrollTo(0, 0);
          }}
        >
          🐾 Login to Continue
        </Button>
      </div>
    </div>
  );
}
export default PetUnLogin;
