//Coder : Dat

//Date: 2025-04-25
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Booking() {
  // DÙng navigate để điều hướng đến các trang khác
  const navigate = useNavigate();

  //useEffect để bật hiệu ứng khi component mount
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Đặt thời gian trì hoãn trước khi kích hoạt hiệu ứng
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50); // Thời gian trì hoãn 500ms (hoặc điều chỉnh tùy theo nhu cầu)

    // Dọn dẹp bộ đếm timer khi component bị hủy
    return () => clearTimeout(timer);
  }, []);

  //Hiệu ứng trượt lên
  const slideUp = `transition-all duration-700 ease-out ${
    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  } `;
  //Hiệu ứng bóng
  const shadowEffect = "shadow-lg hover:shadow-xl";

  //Hiệu ứng phóng to
  const scaleEffect = "hover:scale-110";

  //Hiệu ứng con trỏ
  const cursorEffect = "cursor-pointer";

  //Hiệu ứng chuyển tiếp
  const transitionEffect = "transition duration-200";

  //Hiệu ứng bố cục và nhóm (Layout and Group Effect)
  const layoutEffect = "relative overflow-hidden group";

  //Hiệu ứng cho các card petVet và petSpa
  const baseEffect = `${shadowEffect} ${scaleEffect} ${cursorEffect} ${slideUp}`;
  const transitionAndLayoutEffect = `${transitionEffect} ${layoutEffect}`;
  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto   `}
    >
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-[#6D7AB5] mb-4 font-playfair tracking-wide drop-shadow-lg ${slideUp} `}
      >
        Because every pet deserves extraordinary care
      </h2>
      <p
        className={`text-base sm:text-lg md:text-xl text-center text-gray-800 max-w-3xl mx-auto leading-relaxed mb-10 font-lora ${slideUp}`}
      >
        From energetic pups to gentle kittens and every cherished companion in
        between — we believe every pet deserves to feel safe, healthy, and
        deeply loved. At{" "}
        <span className="text-customPurple font-semibold">PetZone</span>, care
        isn’t just a service, it’s a promise. Explore our personalized services
        and let us help you give your furry friend the joyful, nurturing life
        they deserve.
      </p>

      {/*button about 2 sevices*/}
      <div className="grid grid-cols-2 justify-items-center ">
        {/*petVet*/}

        <button
          className={` w-[300px] bg-white rounded-2xl ${baseEffect} ${transitionAndLayoutEffect}`}
          onClick={() => {
            window.scrollTo(0, 0);
            navigate("/petvet");
          }}
        >
          <img
            src="/img/booking/inactive/petVet.png"
            alt="Vets"
            className="w-[300px] h-[300px] object-cover rounded-t-2xl  transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src="/img/booking/active/petVet-a.png"
            alt="Vets"
            className="w-[300px] h-[300px] absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
          <div className="p-4">
            <h3 className="text-2xl  text-customPurple text-center mb-2 font-serif leading-tight">
              Vet
            </h3>
            <p className="text-gray-700 text-center mb-2 italic font-sans tracking-wide">
              Your pet’s health, our top priority.
            </p>
            <p className="text-gray-600 text-center text-sm font-sans leading-relaxed">
              Dedicated veterinary care to keep your pet healthy and thriving.
              We offer general check-ups, vaccinations, diagnostic testing, and
              specialized treatments.
            </p>
          </div>
        </button>
        {/*petSpa*/}

        <button
          className={` w-[300px] bg-white rounded-2xl  ${baseEffect} ${transitionAndLayoutEffect}`}
          onClick={() => {
            window.scrollTo(0, 0);
            navigate("/petspa");
          }}
        >
          <img
            src="/img/booking/inactive/petSpa-i.png"
            alt="Spa"
            className="w-[300px] h-[300px] object-cover rounded-t-2xl  transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src="/img/booking/active/petSpa-a.png"
            alt="Spa"
            className="w-[300px] h-[300px] absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
          <div className="p-4">
            <h3 className="text-2xl  text-customPurple text-center mb-2 font-serif leading-tight">
              Spa
            </h3>
            <p className="text-gray-700 text-center mb-2 italic font-sans tracking-wide">
              Refresh. Revitalize. Rejoice.
            </p>
            <p className="text-gray-600 text-center text-sm font-sans leading-relaxed">
              Premium spa services to keep your pet looking and feeling their
              best. Our treatments include bathing, hair trimming, ear and nail
              care, and relaxing massages.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Booking;
