// if user logged in, show the pet list
//if user dont have pet, show the message
//if user have pet, show the pet list
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../Appwrapper";
import BookingModal from "./BookingModal";

import axios from "axios";

function PetListForBooking() {
  //Phần này về form
  const { openModal, closeModal } = useModal();

  const handleDetailsClick = () => {
    openModal({
      title: `BOOKING FORM`,
      body: <BookingModal onClose={closeModal} />,
    });
  };

  // Phần này về bảng
  // DÙng navigate để điều hướng đến các trang khác
  const navigate = useNavigate();

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
  const baseEffect = ` ${cursorEffect} `;
  const transitionAndLayoutEffect = `${transitionEffect} ${layoutEffect}`;

  //xu ly lý khi người dùng chưa đăng nhập
  const [petList, setPetList] = useState([]);
  const [hasPet, setHasPet] = useState(false);
  useEffect(() => {
    // Lấy userId từ localStorage
    const userDataString = localStorage.getItem("user_info");

    const userId = userDataString ? JSON.parse(userDataString).id : null;
    console.log(userId);
    if (!userId) {
      // Nếu không có userId, chuyển hướng về trang đăng nhập
      alert("Please log in to view your pet list.");
    }
    // Kiểm tra xem bảng userpets có tồn tại hay không

    // Gọi API để lấy danh sách thú cưng của người dùng
    axios
      .get(`https://thoriumstudio.xyz/api/user/${userId}/userpets`)
      .then((response) => {
        const userpets = response.data;
        if (userpets.length > 0) {
          setPetList(userpets);
          setHasPet(true);
        } else {
          setHasPet(false);
        }
      });
  }, []);
  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto`}
    >
      <h1 className="text-3xl  text-center text-[#6D7AB5] mb-6">
        STEP 1: 🐶 Choose Your Pet to Serve
      </h1>

      {hasPet ? (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full border text-sm text-gray-700 bg-white">
            <thead>
              <tr className="bg-[#F0F4FF] text-[#4A5A93] uppercase text-xs tracking-wider">
                <th className="px-4 py-3 border">#</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Species</th>
                <th className="px-4 py-3 border">Breed</th>
                <th className="px-4 py-3 border">Age</th>
                <th className="px-4 py-3 border">Gender</th>
                <th className="px-4 py-3 border">Weight (kg)</th>
                <th className="px-4 py-3 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {petList.map((pet, index) => (
                <tr
                  key={pet.id}
                  className={`hover:bg-[#E0E7FF] transition duration-200 ${baseEffect} ${transitionAndLayoutEffect}`}
                  onClick={() => {
                    localStorage.setItem("selectedPet", JSON.stringify(pet));
                    handleDetailsClick();
                  }}
                >
                  <td className="px-4 py-3 border text-center">{index + 1}</td>
                  <td className="px-4 py-3 border font-medium">{pet.name}</td>
                  <td className="px-4 py-3 border">{pet.species}</td>
                  <td className="px-4 py-3 border">{pet.breed}</td>
                  <td className="px-4 py-3 border">{pet.age}</td>
                  <td className="px-4 py-3 border capitalize">{pet.gender}</td>
                  <td className="px-4 py-3 border">{pet.weight_kg}</td>
                  <td className="px-4 py-3 border text-gray-500 italic">
                    {pet.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-8 text-gray-600">
          <p className="text-lg">😿 No pets found in your profile.</p>
          <p className="mt-2">
            Please{" "}
            <span className="text-blue-600 font-semibold">add a pet</span> to
            get started.
          </p>
        </div>
      )}
    </div>
  );
}
export default PetListForBooking;
