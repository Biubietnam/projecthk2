//Coder : Dat

//Date: 2025-04-25

// viet hien thi hello world
function Booking() {
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
            <h2 className="text-xl font-bold">Vets</h2>
            <p className="text-gray-600">Find the best vets for your pet</p>
          </div>
        </button>
        {/*petSpa*/}
        <button
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 w-[180px] 
         transform hover:scale-110 transition duration-300 cusor-pointer relative group"
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
            <h2 className="text-xl font-bold">Vets</h2>
            <p className="text-gray-600">Find the best vets for your pet</p>
          </div>
        </button>
        {/*card petEvent*/}
        <button
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 w-[180px] 
         transform hover:scale-110 transition duration-300 cusor-pointer relative group"
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
            <h2 className="text-xl font-bold">Vets</h2>
            <p className="text-gray-600">Find the best vets for your pet</p>
          </div>
        </button>
        {/* card petAvice */}
        <button
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 w-[180px] 
         transform hover:scale-110 transition duration-300 cusor-pointer relative group"
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
            <h2 className="text-xl font-bold">Vets</h2>
            <p className="text-gray-600">Find the best vets for your pet</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Booking;
