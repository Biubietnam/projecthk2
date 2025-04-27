function PetHotel() {
  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-20 ">
      <div class="container mx-auto px-6 py-12">
        {/* Tiêu đề và mô tả */}
        <h2 class="text-4xl font-bold text-center text-customPurple mb-8 font-roboto">
          Pet Zone Pet Hotel
        </h2>
        <p class="text-lg text-center text-gray-700 mb-6">
          We understand that every pet deserves the best care. At{" "}
          <strong className="text-customPurple">Pet Zone</strong>, you can trust
          us with your furry friend's care while you focus on work, travel, or
          business trips without worrying about their well-being.
        </p>

        {/* Các dịch vụ */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dịch vụ 1 */}
          <div class="service-card bg-white rounded-xl   text-center  ">
            <img
              src="./img/booking/hotel/eating.png"
              alt="Relaxation and Care"
              class="w-[180] h-[180] object-cover rounded-lg mb-4"
            />
            <h3 class="text-2xl font-semibold text-customPurple mb-4">
              Relaxation & Care
            </h3>
            <p class="text-gray-700 mb-4">
              Your pet will enjoy delicious meals based on their dietary needs,
              and daily grooming to stay clean and comfortable.
            </p>
            <ul class="list-disc list-inside text-left text-gray-600">
              <li class="text-customPurple">Personalized meals</li>
              <li class="text-customPurple">Daily bathing and grooming</li>
              <li class="text-customPurple">
                Relaxing massage and fur trimming
              </li>
            </ul>
          </div>

          {/* Dịch vụ 2 */}
          <div class="service-card bg-white rounded-xl text-center  ">
            <img
              src="./img/booking/hotel/supervisor.png"
              alt="24/7 Supervision"
              class="w-[180] h-[180] object-cover rounded-lg mb-4"
            />
            <h3 class="text-2xl font-semibold text-customPurple mb-4">
              24/7 Supervision
            </h3>
            <p class="text-gray-700 mb-4">
              We ensure a safe and comfortable environment for your pets with
              constant supervision and care for their health and happiness.
            </p>
            <ul class="list-disc list-inside text-left text-gray-600">
              <li class="text-customPurple">24/7 monitoring</li>
              <li class="text-customPurple">Safe and clean environment</li>
              <li class="text-customPurple">
                Quiet, comfortable sleeping areas
              </li>
            </ul>
          </div>

          {/* Dịch vụ 3 */}
          <div class="service-card bg-white rounded-xl text-center  ">
            <img
              src="./img/booking/hotel/spa.png"
              alt="Specialized Care"
              class="w-[180] h-[180] object-cover rounded-lg mb-4"
            />
            <h3 class="text-2xl font-semibold text-customPurple mb-4">
              Specialized Care
            </h3>
            <p class="text-gray-700 mb-4">
              We offer additional services like bathing, massage, and grooming
              to meet the unique needs of your pet.
            </p>
            <ul class="list-disc list-inside text-left text-gray-600">
              <li class="text-customPurple">Custom care services</li>
              <li class="text-customPurple">
                Bathing, massage, and spa treatments
              </li>
              <li class="text-customPurple">Personalized nutrition plans</li>
            </ul>
          </div>
        </div>

        {/* Đặt lịch */}
        <div class="mt-12 text-center">
          <p class="text-xl text-gray-700 mb-6">
            Don't wait any longer! Bring your furry friends to{" "}
            <span class="font-bold text-customPurple">Pet Zone</span> – where
            they will feel right at home!
          </p>
          <a
            href="tel:+123456789"
            class="bg-[#6D7AB5] text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-rose-700 transition duration-300 transform hover:scale-105"
          >
            Call Now to Book a Service!
          </a>
        </div>
      </div>
    </div>
  );
}
export default PetHotel;
