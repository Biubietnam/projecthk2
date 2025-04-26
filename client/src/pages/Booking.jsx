//Coder : Dat

import { useNavigate } from "react-router-dom";
//Date: 2025-04-25

// viet hien thi hello world
function Booking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-20">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-pink-600 mb-4 font-playfair tracking-wide drop-shadow-lg">
        Because every pet deserves extraordinary care
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-center text-gray-800 max-w-3xl mx-auto leading-relaxed mb-10 font-lora">
        From energetic pups to gentle kittens and every cherished companion in
        between — we believe every pet deserves to feel safe, healthy, and
        deeply loved. At{" "}
        <span className="text-pink-600 font-semibold">PetZone</span>, care isn’t
        just a service, it’s a promise. Explore our personalized services and
        let us help you give your furry friend the joyful, nurturing life they
        deserve.
      </p>

      {/*button about 4 sevices*/}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-10  max-w-screen-lg mx-auto">
        {/*petVet*/}
        <button
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 w-[180px] 
         transform hover:scale-110 transition duration-300 cusor-pointer relative group "
          onClick={() => {
            navigate("/petvet");
          }}
        >
          <img
            src="/img/booking/inactive/petVet.png"
            alt="Vets"
            className="w-[180px] h-[180px] object-cover rounded-t-2xl  transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src="/img/booking/active/petVet-a.png"
            alt="Vets"
            className="w-[180px] h-[180px] absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
          <div className="p-4">
            <h3 className="text-2xl font-bold text-rose-600 text-center mb-2 font-serif leading-tight">
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
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 w-[180px] 
         transform hover:scale-110 transition duration-300 cusor-pointer relative group"
          onClick={() => {
            navigate("/petspa");
          }}
        >
          <img
            src="/img/booking/inactive/petSpa-i.png"
            alt="Spa"
            className="w-[180px] h-[180px] object-cover rounded-t-2xl  transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src="/img/booking/active/petSpa-a.png"
            alt="Spa"
            className="w-[180px] h-[180px] absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
          <div className="p-4">
            <h3 className="text-2xl font-bold text-rose-600 text-center mb-2 font-serif leading-tight">
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

        {/* petHotel*/}
        <button
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 w-[180px] 
         transform hover:scale-110 transition duration-300 cusor-pointer relative group"
          onClick={() => {
            navigate("/pethotel");
          }}
        >
          <img
            src="/img/booking/inactive/petHotel-i.png"
            alt="Hotel"
            className="w-[180px] h-[180px] object-cover rounded-t-2xl  transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src="/img/booking/active/petHotel-a.png"
            alt="Hotel"
            className="w-[180px] h-[180px] absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
          <div className="p-4">
            <h3 className="text-2xl font-bold text-rose-600 text-center mb-2 font-serif leading-tight">
              Hotel
            </h3>
            <p className="text-gray-700 text-center mb-2 italic font-sans tracking-wide">
              A home away from home.
            </p>
            <p className="text-gray-600 text-center text-sm font-sans leading-relaxed">
              Safe, clean, and fully equipped accommodations for your pet’s
              stay. We provide private rooms, 24/7 monitoring, and customized
              care options.
            </p>
          </div>
        </button>

        {/* card petEvent */}
        <button
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 w-[180px] 
         transform hover:scale-110 transition duration-300 cusor-pointer relative group"
          onClick={() => {
            navigate("/petevent");
          }}
        >
          <br />
          <br />
          <img
            src="/img/booking/inactive/petEvent-i.png"
            alt="Event"
            className="w-[180px] h-[180px] object-cover rounded-t-2xl  transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src="/img/booking/active/petEvent-a.png"
            alt="Event"
            className="w-[180px] h-[180px] absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
          <div className="p-4">
            <h3 className="text-2xl font-bold text-rose-600 text-center mb-2 font-serif leading-tight">
              Event
            </h3>
            <p className="text-gray-700 text-center mb-2 italic font-sans tracking-wide">
              Celebrate every moment with your pet.
            </p>
            <p className="text-gray-600 text-center text-sm font-sans leading-relaxed">
              Professionally organized pet events that bring the pet community
              together. We host health fairs, costume parties, and engaging
              social activities for pets and owners.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Booking;
