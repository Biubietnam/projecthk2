import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PetSpa() {
  // DÙng navigate để điều hướng đến các trang khác
  const navigate = useNavigate();

  //Tinh nang wait load trang
  //useEffect để bật hiệu ứng khi component mount
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Đặt thời gian trì hoãn trước khi kích hoạt hiệu ứng
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Thời gian trì hoãn 500ms (hoặc điều chỉnh tùy theo nhu cầu)

    // Dọn dẹp bộ đếm timer khi component bị hủy
    return () => clearTimeout(timer);
  }, []);

  //Hiệu ứng chuyển tiếp
  const transitionEffect = "transition-all duration-1000 ease-out";
  //Hiệu ứng trượt lên
  const slideUp = `${transitionEffect}  ${
    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  } `;
  //Hiệu ứng từ trái qua
  const slideFromLeft = `${transitionEffect}  ${
    isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[-100%]"
  }`;

  //Hiệu ứng từ phải qua
  const slideFromRight = `${transitionEffect}  ${
    isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[100%]"
  }`;

  //Hiệu ứng bóng
  const shadowEffect = "shadow-lg hover:shadow-xl";

  //Hiệu ứng phóng to
  const scaleEffect = "hover:scale-110";

  //Hiệu ứng con trỏ
  const cursorEffect = "cursor-pointer";

  //Hiệu ứng bố cục và nhóm (Layout and Group Effect)
  const layoutEffect = "relative overflow-hidden group";

  const baseEffect = `${shadowEffect} ${scaleEffect} ${cursorEffect} ${slideUp}`;
  const transitionAndLayoutEffect = `${transitionEffect} ${layoutEffect}`;

  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto`}
    >
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-[#6D7AB5] pb-10 mb-4 font-playfair tracking-wide drop-shadow-lg ${slideUp} `}
      >
        🛁 Spa & Grooming at Pet Zone
      </h2>

      {/* Description about Petzone Spa Grooming*/}
      <div className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center ">
        <div className={`${slideFromLeft} ${transitionEffect} `}>
          <h3 className="text-xl md:text-2xl lg:text-3xl text-[#6D7AB5] font-semibold mb-6">
            Five-Star Pampering, Genuine Care
          </h3>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-6 leading-relaxed">
            At <span className="font-semibold text-[#6D7AB5]">Pet Zone</span>,
            we believe every pet deserves to be cared for with love, treated
            with respect, and pampered like royalty. Our luxury Spa & Grooming
            services go beyond the basics — delivering a full wellness
            experience that leaves your furry companions looking their best and
            feeling even better.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed">
            From soothing herbal baths to expert grooming sessions, every
            service is performed with precision, patience, and heartfelt care.
            Because at Pet Zone,{" "}
            <span className="italic text-[#6D7AB5] font-semibold">
              we don’t just groom pets, we celebrate them.
            </span>
          </p>
        </div>
        <div className={`${slideFromRight}`}>
          <img
            src="/img/booking/spa/grooming-banner.png"
            alt="Pet grooming at Pet Zone"
            className=" sm:w-[400px] h-auto md:w-[500px] h-auto lg:w-[600px] h-auto "
          />
        </div>
      </div>

      {/*Description about combo spa*/}
      <div className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center mt-32 ">
        <div className={`${slideFromLeft}`}>
          <img
            src="/img/booking/spa/comboSpa-banner.png"
            alt="Pet grooming at Pet Zone"
            className=" sm:w-[400px] h-auto md:w-[500px] h-auto lg:w-[600px] h-auto "
          />
        </div>
        <div className={`${slideFromRight} ${transitionEffect} `}>
          <h3 className="text-xl md:text-2xl lg:text-3xl text-[#6D7AB5] font-semibold mb-6">
            Five-Star Pampering, Genuine Care
          </h3>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-6 leading-relaxed">
            At <span className="font-semibold text-[#6D7AB5]">Pet Zone</span>,
            we believe every pet deserves to be cared for with love, treated
            with respect, and pampered like royalty. Our luxury Spa & Grooming
            services go beyond the basics — delivering a full wellness
            experience that leaves your furry companions looking their best and
            feeling even better.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed">
            From soothing herbal baths to expert grooming sessions, every
            service is performed with precision, patience, and heartfelt care.
            Because at Pet Zone,{" "}
            <span className="italic text-[#6D7AB5] font-semibold">
              we don’t just groom pets, we celebrate them.
            </span>
          </p>
        </div>
      </div>

      {/*3 Combo Spa*/}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-[#6D7AB5] pb-10 mb-4 font-playfair tracking-wide drop-shadow-lg ${slideUp}  mt-32`}
      >
        🛁 Spa & Grooming at Pet Zone
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center">
        {/* BASIC SPA */}
        <div
          className={`w-[300px] bg-white rounded-2xl ${baseEffect} ${transitionAndLayoutEffect}`}
        >
          <div className="p-4">
            <h3 className="text-2xl font-bold text-[#6D7AB5]  ">Basic Spa</h3>
            <p className="text-gray-600 text-lg md:text-lg lg:text-lg mb-2 leading-relaxed">
              10-Step Relaxation Ritual
            </p>
            <p className="text-gray-600 text-base md:text-base lg:text-base mb-6 leading-relaxed">
              Duration: 1 hour
            </p>
            <ul className=" text-gray-600 text-base md:text-base lg:text-base mb-6 leading-relaxed">
              <li>Gentle bath with pet-safe shampoo</li>
              <li>Ear cleaning</li>
              <li>Nail trimming</li>
              <li>Teeth cleaning</li>
              <li>Blow-dry and light brushing</li>
              <li>Coat brushing</li>
              <li>Paw balm application</li>
              <li>Pet-safe fragrance spray</li>
              <li>General health check</li>
              <li>Grooming advice for home care</li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 text-2xl md:text-lg lg:text-xl mb-6 leading-relaxed">
              $10
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full w-full transition-all duration-300">
              Book Now
            </button>
          </div>
        </div>

        {/* PREMIUM SPA */}
        <div
          className={`w-[300px] bg-white rounded-2xl ${baseEffect} ${transitionAndLayoutEffect}`}
        >
          <div className="p-4">
            <h3 className="text-2xl font-bold text-[#6D7AB5]">Premium Spa</h3>
            <p className="text-gray-600 text-2xl md:text-lg lg:text-xl mb-6 leading-relaxed">
              11-Step Ultimate Care
            </p>
            <p className="text-gray-600 text-2xl md:text-lg lg:text-xl mb-6 leading-relaxed">
              Duration: 1.25 hours
            </p>
            <ul className="text-gray-600 text-base md:text-base lg:text-base  leading-relaxed">
              <li>Bath with premium shampoo & conditioner</li>
              <li>Eye & ear deep cleaning</li>
              <li>Nail trimming and paw pad cleansing</li>
              <li>Teeth brushing with dental foam</li>
              <li>Relaxation massage</li>
              <li>Blow-dry and basic styling</li>
              <li>Skin treatment (for dryness/itching)</li>
              <li>Coat brushing and shine enhancement</li>
              <li>Natural fragrance spray</li>
              <li>Full-body check-up</li>
              <li>Home care tips and diet suggestions</li>
              <br />
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 text-2xl md:text-lg lg:text-xl mb-6 leading-relaxed">
              $16
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full w-full transition-all duration-300">
              Book Now
            </button>
          </div>
        </div>

        {/* ULTRA SPA */}
        <div
          className={`w-[300px] h-[500px] bg-white rounded-2xl ${baseEffect} ${transitionAndLayoutEffect}`}
        >
          <div className="p-4">
            <h3 className="text-4xl font-bold text-[#6D7AB5] my-3">
              Ultra Spa
            </h3>
            <p className="text-gray-600 text-2xl md:text-lg lg:text-xl mb-6 leading-relaxed">
              12-Step Luxury Experience
            </p>
            <p className="text-sm text-gray-500 mb-4">Duration: 1.5 hours</p>
            <ul className="text-gray-600 text-base md:text-base lg:text-base mb-6 leading-relaxed">
              <li>Bath for sensitive or specific needs</li>
              <li>Deep ear & eye cleaning</li>
              <li>Nail trim, paw & sensitive skin care</li>
              <li>Advanced dental cleaning</li>
              <li>Full-body massage with essential oils</li>
              <li>Premium blow-dry and custom styling</li>
              <li>Skin care for sensitive skin</li>
              <li>Coat detangling and nutrition treatment</li>
              <li>Coat mist with natural essential oils</li>
              <li>Health screening (eyes, ears, skin, joints)</li>
              <li>Diet & behavior consultation</li>
              <li>Free gift pack (treats or care items)</li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 text-2xl md:text-lg lg:text-xl mb-6 leading-relaxed">
              $22
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full w-full transition-all duration-300">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PetSpa;
