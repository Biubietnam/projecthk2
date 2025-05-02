import { motion } from "framer-motion";

function PetVet() {
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
          className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-[#6D7AB5] pb-10 mb-4 font-playfair tracking-wide drop-shadow-lg `}
        >
          🐾 Pet Healthcare Services at PetZone
        </h2>
      </motion.div>

      {/* Description about health service 6 service*/}
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center mt-20 ">
        {/* Description about kham tong quat*/}
        <motion.div
          initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl text-[#6D7AB5] font-semibold mb-6">
            🩺 PetZone General Check-Up
          </h3>
          <p className="text-base md:text-base lg:text-xl text-[#6D7AB5] font-semibold mb-6">
            Routine and personalized health check-ups to help your furry friends
            stay strong, happy, and disease-free.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-6 leading-relaxed">
            Our experienced vets provide thorough health assessments tailored to
            your pet’s age, breed, and lifestyle. With modern equipment and
            up-to-date knowledge, we help detect issues early and support your
            pet’s long-term well-being.
          </p>
          <button className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 active:bg-yellow-300 border border-yellow-300 font-bold text-lg py-3 px-6 rounded-full w-full transition-all duration-300 shadow-sm hover:shadow-md">
            Book Now
          </button>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/img/booking/vet/petCareGeneral.png"
            alt="Pet care General Check-Up"
            className=" sm:w-[300px] h-auto md:w-[400px] h-auto lg:w-[500px] h-auto "
          />
        </motion.div>
      </div>

      {/* Description about kham tai nha*/}
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center mt-10 ">
        <motion.div
          initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/img/booking/vet/petCareHome.png"
            alt="Pet Care Home Check-Up"
            className=" sm:w-[300px]  md:w-[400px] h-auto lg:w-[500px] h-auto "
          />
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl text-[#6D7AB5] font-semibold mb-6">
            🏠 PetZone Vet at Home
          </h3>
          <p className="text-base md:text-base lg:text-xl text-[#6D7AB5] font-semibold mb-6">
            Convenient veterinary care brought right to your door.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-6 leading-relaxed">
            Too busy to visit the clinic? No worries — our experienced vets come
            to you! Whether it’s a health check, vaccination, or consultation,
            we provide professional care for your pets in the comfort of your
            own home, with modern equipment and gentle handling.
          </p>
          <button className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 active:bg-yellow-300 border border-yellow-300 font-bold text-lg py-3 px-6 rounded-full w-full transition-all duration-300 shadow-sm hover:shadow-md">
            Book Now
          </button>
        </motion.div>
      </div>

      {/* Description about tiem phong thu cung*/}
      <motion.div
        initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>
      {/* Description about sieu am thu cung*/}
      <motion.div
        initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>
      {/* Description about triet san thu cung*/}
      <motion.div
        initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>
      {/* Description about tai sao chon PetZone*/}
      <motion.div
        initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      ></motion.div>
    </div>
  );
}
export default PetVet;
