import { motion } from "framer-motion";

function PetSpa() {
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
  const baseEffect = `${shadowEffect} ${scaleEffect} ${cursorEffect}`;
  const transitionAndLayoutEffect = `${transitionEffect} ${layoutEffect}`;

  //Hiệu ứng chuyển màu bg

  const combobg = `bg-white hover:bg-[#F0F4FF] p-8 transition-all duration-300`;
  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto`}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-[#6D7AB5] p-4  font-playfair tracking-wide drop-shadow-lg `}
        >
          🛁 Spa & Grooming at Pet Zone
        </h2>
        <p
          className={`text-base sm:text-lg md:text-xl text-center text-gray-800 max-w-3xl mx-auto leading-relaxed mb-10 font-lora `}
        >
          Gentle grooming, loving care – helping your pet look great and feel
          even better.
        </p>
      </motion.div>

      {/* Description about Petzone Spa Grooming*/}
      <div className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center ">
        <motion.div
          initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
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
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/img/booking/spa/grooming-banner.png"
            alt="Pet grooming at Pet Zone"
            className=" sm:w-[400px] h-auto md:w-[500px] h-auto lg:w-[600px] h-auto "
          />
        </motion.div>
      </div>

      {/*Description about combo spa*/}
      <div className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center mt-20 ">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <img
            src="/img/booking/spa/comboSpa-banner.png"
            alt="Pet grooming at Pet Zone"
            className=" sm:w-[400px] h-auto md:w-[500px] h-auto lg:w-[600px] h-auto "
          />
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl text-[#6D7AB5] font-semibold mb-6">
            Perfect Spa Combos – Made Just for Your Pet
          </h3>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl  leading-relaxed mb-3">
            Every pet is unique — with different needs, personalities, and ways
            they love to be cared for. That’s why at{" "}
            <span className="font-semibold text-[#6D7AB5]">Pet Zone</span>,
            we’ve carefully designed a range of Spa & Grooming Combos to suit
            every furry friend. feeling even better.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed mb-3">
            Whether your pet just needs a gentle refresh or a full day of
            pampering, we’ve got the perfect combo. From soothing baths and coat
            care to massages, skin therapy, and more — each step is done with
            patience, love, and expert hands.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed">
            Because at{" "}
            <span className="font-semibold text-[#6D7AB5]">Pet Zone</span>, it’s
            not just about looking good — it’s about helping pets feel happy,
            healthy, and loved. Choose the spa combo that fits your pet best,
            and let them shine inside and out!
          </p>
        </motion.div>
      </div>

      {/*3 Combo Spa*/}
      <motion.h2
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-[#6D7AB5] pb-10 mb-4 font-playfair tracking-wide drop-shadow-lg  mt-32`}
      >
        Our Most-Loved Spa Packages
      </motion.h2>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 justify-items-center"
      >
        {/* BASIC SPA */}
        <div
          className={`w-[300px] bg-white rounded-2xl ${baseEffect} ${transitionAndLayoutEffect} ${combobg}`}
        >
          <div className="p-4">
            <h3 className="text-2xl font-bold text-[#6D7AB5]">Basic Spa</h3>
            <p className="text-gray-600 text-lg mb-2 leading-relaxed">
              10-Step Relaxation Ritual
            </p>
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              Duration: 1 hour
            </p>
            <ul className="text-gray-600 text-base mb-6 leading-relaxed space-y-2">
              {[
                "Gentle bath with pet-safe shampoo",
                "Ear cleaning",
                "Nail trimming",
                "Teeth cleaning",
                "Blow-dry and light brushing",
                "Coat brushing",
                "Paw balm application",
                "Pet-safe fragrance spray",
                "General health check",
                "Grooming advice for home care",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg
                    className="h-4 w-4 text-green-500 mt-1 mr-2 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-[232px] bg-[#6D7AB5] text-[#FFFFFF] hover:bg-[#4E5C8A] active:bg-[#4E5C8A] border border-[#4E5C8A] font-bold text-lg py-3 px-6 rounded-full w-full transition-all duration-300 shadow-sm hover:shadow-md">
            Book Now
          </button>
        </div>

        {/* PREMIUM SPA */}
        <div
          className={` h-auto w-[300px]  rounded-2xl shadow-lg ${combobg}${baseEffect} ${transitionAndLayoutEffect} `}
        >
          <div className="p-4">
            <h3 className="text-2xl font-bold text-[#6D7AB5]">Premium Spa</h3>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              11-Step Ultimate Care
            </p>
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              Duration: 1.25 hours
            </p>
            <ul className="text-gray-600 text-base leading-relaxed space-y-2">
              {[
                "Bath with premium shampoo & conditioner",
                "Eye & ear deep cleaning",
                "Nail trimming and paw pad cleansing",
                "Teeth brushing with dental foam",
                "Relaxation massage",
                "Blow-dry and basic styling",
                "Skin treatment (for dryness/itching)",
                "Coat brushing and shine enhancement",
                "Natural fragrance spray",
                "Full-body check-up",
                "Home care tips and diet suggestions",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg
                    className="h-4 w-4 text-green-500 mt-1 mr-2 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-[112px] bg-[#6D7AB5] text-[#FFFFFF] hover:bg-[#4E5C8A] active:bg-[#4E5C8A] border border-[#4E5C8A] font-bold text-lg py-3 px-6 rounded-full w-full transition-all duration-300 shadow-sm hover:shadow-md">
            Book Now
          </button>
        </div>

        {/* ULTRA SPA */}
        <div
          className={`w-[300px] bg-white rounded-2xl ${baseEffect} ${transitionAndLayoutEffect} ${combobg}`}
        >
          <div className="p-4">
            <h3 className="text-2xl font-bold text-[#6D7AB5]">Ultra Spa</h3>
            <p className="text-gray-600 text-lg mb-2 leading-relaxed">
              12 Steps of Pet Luxury
            </p>
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              Duration: 1.5 hours
            </p>
            <ul className="text-gray-600 text-base mb-6 leading-relaxed space-y-2">
              {[
                "Bath for sensitive or specific needs",
                "Deep ear & eye cleaning",
                "Nail trim, paw & sensitive skin care",
                "Advanced dental cleaning",
                "Full-body massage with essential oils",
                "Premium blow-dry and custom styling",
                "Skin care for sensitive skin",
                "Coat detangling and nutrition treatment",
                "Coat mist with natural essential oils",
                "Health screening (eyes, ears, skin, joints)",
                "Diet & behavior consultation",
                "Free gift pack (treats or care items)",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg
                    className="h-4 w-4 text-green-500 mt-1 mr-2 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button className="bg-[#6D7AB5] text-[#FFFFFF] hover:bg-[#4E5C8A] active:bg-[#4E5C8A] border border-[#4E5C8A] font-bold text-lg py-3 px-6 rounded-full w-full transition-all duration-300 shadow-sm hover:shadow-md">
              Book Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PetSpa;
