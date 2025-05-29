import React, { useState } from "react";
import { useModal } from "../../Appwrapper";
import BookingModal from "./BookingModal";

function ServiceBooking() {
  const { openModal, closeModal } = useModal();

  const handleDetailsClick = () => {
    openModal({
      title: `BOOKING FORM`,
      body: <BookingModal onClose={closeModal} />,
    });
  };
  // State to manage the modal visibility

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
  const baseEffect = ` ${cursorEffect} ${scaleEffect} ${shadowEffect} ${layoutEffect}`;
  const transitionAndLayoutEffect = `${transitionEffect} ${layoutEffect}`;

  return (
    <div className="min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto">
      <h1 className="text-3xl  text-center mb-6 text-[#6D7AB5]">
        Step 2: Booking Service
      </h1>
      <p className="text-center text-gray-600 mb-10">Choose your service.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Vet at Home */}
        <div
          className={`bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 ${baseEffect} ${transitionAndLayoutEffect}`}
        >
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

        {/* Vet at Clinic */}
        <div
          className={`bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 ${baseEffect} ${transitionAndLayoutEffect}`}
          onClick={handleDetailsClick}
        >
          <img
            src="/img/service/vetClinic.png"
            alt="Vet at Clinic"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <h3 className="text-xl font-semibold text-[#6D7AB5] mb-2">
            Vet at Clinic
          </h3>
          <p className="text-gray-600 mb-2">
            Visit our clinic for advanced diagnostics and treatments.
          </p>
          <span className="inline-block bg-[#E0E7FF] text-[#4B55A5] text-sm font-medium px-3 py-1 rounded-full">
            ⏱ 30 minutes
          </span>
        </div>

        {/* Vet Spa */}
        <div
          className={`bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 ${baseEffect} ${transitionAndLayoutEffect}`}
        >
          <img
            src="/img/service/vetSpa.png"
            alt="Vet Spa"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <h3 className="text-xl font-semibold text-[#6D7AB5] mb-2">Vet Spa</h3>
          <p className="text-gray-600 mb-4">
            Relax and refresh your pets with our premium spa services.
          </p>

          {/* Spa Packages */}
          <ul className="space-y-2">
            <li className="flex justify-between items-center bg-[#F9FAFB] px-3 py-2 rounded-md border">
              <span className="text-gray-700 font-medium">Basic Spa</span>
              <span className="text-sm text-gray-500">⏱ 1 hour</span>
            </li>
            <li className="flex justify-between items-center bg-[#F9FAFB] px-3 py-2 rounded-md border">
              <span className="text-gray-700 font-medium">Premium Spa</span>
              <span className="text-sm text-gray-500">⏱ 1.25 hours</span>
            </li>
            <li className="flex justify-between items-center bg-[#F9FAFB] px-3 py-2 rounded-md border">
              <span className="text-gray-700 font-medium">Ultra Spa</span>
              <span className="text-sm text-gray-500">⏱ 1.5 hours</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default ServiceBooking;
