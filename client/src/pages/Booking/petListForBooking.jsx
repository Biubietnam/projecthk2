//if user logged in, show the pet list
//if user dont have pet, show the message
//if user have pet, show the pet list
import React, { useEffect, useState } from "react";

import { useModal } from "../../Appwrapper";
import BookingModal from "./BookingModal";
import AddPetModal from "./AddPetModal";

import axios from "axios";

function PetListForBooking() {
  //Phần này về form
  const { openModal, closeModal } = useModal();

  const BookingClick = () => {
    openModal({
      title: `BOOKING FORM`,
      body: <BookingModal onClose={closeModal} />,
    });
  };

  const AddPetClick = () => {
    openModal({
      title: `ADD PET`,
      body: (
        <AddPetModal
          onClose={closeModal}
          onPetAdded={() => {
            closeModal();
            fetchPetList(); // Cập nhật lại danh sách thú cưng sau khi thêm}
          }}
        />
      ),
    });
  };

  // Phần này về bảng

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

  const fetchPetList = () => {
    const userDataString = localStorage.getItem("user_info");
    const userId = userDataString ? JSON.parse(userDataString).id : null;

    if (!userId) {
      alert("Please log in to view your pet list.");
      return;
    }

    axios
      .get(`http://localhost:8000/api/user/${userId}/userpets`)
      .then((response) => {
        const userpets = response.data;
        if (userpets.length > 0) {
          setPetList(userpets);
          setHasPet(true);
        } else {
          setHasPet(false);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch pets", error);
        setHasPet(false);
      });
  };
  useEffect(() => {
    fetchPetList();
  }, []);
  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto`}
    >
      <h1 className="text-3xl font-bold text-center text-[#6D7AB5] mb-6">
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
                    BookingClick();
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
            <span
              className="text-blue-600 font-semibold hover: cursor-pointer"
              onClick={AddPetClick}
            >
              add a pet
            </span>{" "}
            to get started.
          </p>
          <button
            className="mt-4 bg-[#6D7AB5] text-white px-6 py-2 rounded hover:bg-[#5A6A9B] transition-colors"
            onClick={AddPetClick}
          >
            Add Pet
          </button>
        </div>
      )}
    </div>
  );
}
export default PetListForBooking;
