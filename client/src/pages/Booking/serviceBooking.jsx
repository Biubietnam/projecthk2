function ServiceBooking() {
  return (
    <div className="min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#6D7AB5]">
        STEP 2: Booking Service
      </h1>
      <p className="text-center text-gray-600 mb-10">Choose your service.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
          <img
            src="/img/service/vetHome.png"
            alt="Vet at Home"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <h3 className="text-xl font-semibold text-[#6D7AB5] mb-2">
            Vet at Home
          </h3>
          <p className="text-gray-600">
            Get professional care at the comfort of your home.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
          <img
            src="/img/service/vetClinic.png"
            alt="Vet at Clinic"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <h3 className="text-xl font-semibold text-[#6D7AB5] mb-2">
            Vet at Clinic
          </h3>
          <p className="text-gray-600">
            Visit our clinic for advanced diagnostics and treatments.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
          <img
            src="/img/service/vetSpa.png"
            alt="Vet Spa"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <h3 className="text-xl font-semibold text-[#6D7AB5] mb-2">Vet Spa</h3>
          <p className="text-gray-600">
            Relax and refresh your pets with our premium spa services.
          </p>
        </div>
      </div>
    </div>
  );
}
export default ServiceBooking;
