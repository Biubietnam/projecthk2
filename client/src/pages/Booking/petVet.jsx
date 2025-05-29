import { motion } from "framer-motion";
import CheckLogButton from "../../components/CheckLogButton";
import { useNavigate } from "react-router-dom";

function PetVet() {
  //Khai báo điều hướng navigate
  const navigate = useNavigate();
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
          🐾 Pet Healthcare Services at PetZone
        </h2>
        <p
          className={`text-base sm:text-lg md:text-xl text-center text-gray-800 max-w-3xl mx-auto leading-relaxed mb-10 font-lora `}
        >
          Comprehensive, compassionate care for every stage of your pet’s life.
        </p>
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
          <CheckLogButton
            LoggedIn={() => {
              navigate("/petlist");
              window.scrollTo(0, 0);
            }}
            NotLoggedIn={() => {
              navigate("/petUnLogin");
              window.scrollTo(0, 0);
            }}
            className=" text-lg py-3 px-6  w-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Book Now
          </CheckLogButton>
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
          viewport={{ once: true, amount: 0.2 }}
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
          viewport={{ once: true, amount: 0.2 }}
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
          <CheckLogButton
            LoggedIn={() => {
              navigate("/petlist");
              window.scrollTo(0, 0);
            }}
            NotLoggedIn={() => {
              navigate("/petUnLogin");
              window.scrollTo(0, 0);
            }}
            className=" text-lg py-3 px-6  w-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Book Now
          </CheckLogButton>
        </motion.div>
      </div>

      {/* Description about tiem phong thu cung*/}
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center mt-10 ">
        <motion.div
          initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl text-[#6D7AB5] font-semibold mb-6">
            💉 PetZone Immunization Care
          </h3>
          <p className="text-base md:text-base lg:text-xl text-[#6D7AB5] font-semibold mb-6">
            Shield your pet from illness with vaccines.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-6 leading-relaxed">
            At PetZone, we provide a full range of vaccines tailored to your
            pet’s age, lifestyle, and health condition. All vaccines are stored
            and administered under strict standards to ensure maximum
            protection. Our team offers gentle handling and clear guidance,
            making the vaccination process smooth and stress-free — for both you
            and your pet.
          </p>
          <CheckLogButton
            LoggedIn={() => {
              navigate("/petlist");
              window.scrollTo(0, 0);
            }}
            NotLoggedIn={() => {
              navigate("/petUnLogin");
              window.scrollTo(0, 0);
            }}
            className=" text-lg py-3 px-6  w-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Book Now
          </CheckLogButton>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/img/booking/vet/petVaccine.png"
            alt="Pet Vaccine"
            className=" sm:w-[300px]  md:w-[400px] h-auto lg:w-[500px] h-auto "
          />
        </motion.div>
      </div>

      {/* Description about sieu am thu cung*/}
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center mt-10 ">
        <motion.div
          initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/img/booking/vet/petScan.png"
            alt="Pet Scan"
            className=" sm:w-[300px]  md:w-[400px] h-auto lg:w-[500px] h-auto "
          />
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {" "}
          <h3 className="text-xl md:text-2xl lg:text-3xl text-[#6D7AB5] font-semibold mb-6">
            🩻 PetZone 4D Ultrasound Scan
          </h3>
          <p className="text-base md:text-base lg:text-xl text-[#6D7AB5] font-semibold mb-6">
            Advanced imaging for accurate, non-invasive diagnosis.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-6 leading-relaxed">
            At PetZone, we use 4D ultrasound technology with high-resolution HD
            probes and specialized veterinary software to deliver detailed
            internal images of your pet. Whether it’s pregnancy monitoring,
            abdominal issues, or internal health checks, our scans help detect
            problems early — safely and comfortably. Quick, gentle, and highly
            informative — for peace of mind and better treatment planning.
          </p>
          <CheckLogButton
            LoggedIn={() => {
              navigate("/petlist");
              window.scrollTo(0, 0);
            }}
            NotLoggedIn={() => {
              navigate("/petUnLogin");
              window.scrollTo(0, 0);
            }}
            className=" text-lg py-3 px-6  w-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Book Now
          </CheckLogButton>
        </motion.div>
      </div>

      {/* Description about triet san thu cung*/}
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center mt-10 ">
        <motion.div
          initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl text-[#6D7AB5] font-semibold mb-6">
            🐾 PetZone Spay & Neuter Care
          </h3>
          <p className="text-base md:text-base lg:text-xl text-[#6D7AB5] font-semibold mb-6">
            Gentle, safe sterilization for a healthier and happier life.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-6 leading-relaxed">
            Spaying or neutering your pet is a responsible choice that supports
            long-term health, prevents certain diseases, and can reduce unwanted
            behaviors. At PetZone, we provide safe and compassionate care
            through every stage — from consultation to recovery. Our veterinary
            team follows trusted procedures and uses modern equipment to ensure
            comfort and safety for your furry friend.
          </p>
          <CheckLogButton
            LoggedIn={() => {
              navigate("/petlist");
              window.scrollTo(0, 0);
            }}
            NotLoggedIn={() => {
              navigate("/petUnLogin");
              window.scrollTo(0, 0);
            }}
            className=" text-lg py-3 px-6  w-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Book Now
          </CheckLogButton>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }} //trượt từ bên phải
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/img/booking/vet/petSpray.png"
            alt="Pet Spray"
            className=" sm:w-[300px]  md:w-[400px] h-auto lg:w-[500px] h-auto "
          />
        </motion.div>
      </div>
      {/* Description about tai sao chon PetZone*/}
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-items-center mt-10 ">
        <motion.div
          initial={{ x: -100, opacity: 0 }} //trượt từ bên trái
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/img/booking/vet/petZoneChoose.png"
            alt="PetWhyChoosePetZone"
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
            ❤️ Why Choose PetZone?
          </h3>
          <p className="text-base md:text-base lg:text-xl text-[#6D7AB5] font-semibold mb-6">
            Trusted care, advanced technology, and a whole lot of love.
          </p>
          <p className="text-gray-600 text-base md:text-lg lg:text-sl mb-6 leading-relaxed">
            <ul>
              {" "}
              <li>
                🩺 <strong>Experienced Veterinarians</strong> – A dedicated team
                that truly cares.
              </li>{" "}
              <li>
                🧪 <strong>Modern Equipment</strong> – From 4D ultrasound to
                in-home care tools.
              </li>{" "}
              <li>
                🐾 <strong>Full-Service Clinic</strong> – Check-ups, vaccines,
                grooming, surgery & more.
              </li>{" "}
              <li>
                🚪 <strong>Convenient Options</strong> – On-site or at-home,
                we’re here when you need us.
              </li>{" "}
              <li>
                💬 <strong>Clear Communication</strong> – We guide you through
                every step.
              </li>{" "}
              <li>
                🐶 <strong>Gentle Approach</strong> – Stress-free care for pets
                of all ages.
              </li>{" "}
            </ul>{" "}
            <p>
              <em>
                Because your pet deserves not just care—but PetZone-level care.
              </em>
            </p>
          </p>
          <CheckLogButton
            LoggedIn={() => {
              navigate("/petlist");
              window.scrollTo(0, 0);
            }}
            NotLoggedIn={() => {
              navigate("/petUnLogin");
              window.scrollTo(0, 0);
            }}
            className=" text-lg py-3 px-6  w-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Book Now
          </CheckLogButton>
        </motion.div>
      </div>
    </div>
  );
}
export default PetVet;
