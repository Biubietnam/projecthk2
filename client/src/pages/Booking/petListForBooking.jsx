import React, { useEffect, useState } from "react";
import { useModal } from "../../Appwrapper";
import BookingModal from "./BookingModal";
import AddPetModal from "./AddPetModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PetListForBooking() {
  const { openModal, closeModal } = useModal();
  const [petList, setPetList] = useState([]);
  const [hasPet, setHasPet] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);

  const navigate = useNavigate();

  const handleModalClose = () => {
    closeModal(); // Gọi hàm đóng modal cũ
    navigate("/mybooking"); // Chuyển trang sang MyBooking
  };
  const openBookingModal = (pet) => {
    localStorage.setItem("selectedPet", JSON.stringify(pet));
    openModal({
      body: <BookingModal onClose={handleModalClose} />,
    });
  };

  const openAddPetModal = () => {
    setShowAddPetModal(true);
  };

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
        const userpets = response.data || [];
        setPetList(userpets);
        setHasPet(userpets.length > 0);
      })
      .catch((error) => {
        console.error("Failed to fetch pets", error);
        setPetList([]);
        setHasPet(false);
      });
  };

  useEffect(() => {
    fetchPetList();
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 mx-auto font-sans">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-[#4F5D9B] mb-8 tracking-wide drop-shadow-sm">
        STEP 1: 🐶 Choose Your Pet to Serve
      </h1>

      {hasPet ? (
        <div className="overflow-x-auto rounded-2xl  ">
          <div className="flex justify-center mb-8">
            <button
              onClick={openAddPetModal}
              className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-500 text-white px-8 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            >
              + Add More Pet
            </button>
          </div>
          <table className="min-w-full border-collapse text-gray-800">
            <thead>
              <tr className="bg-[#E4E9F7] text-[#3B4371] uppercase text-xs sm:text-sm md:text-base font-semibold tracking-wide select-none">
                {[
                  "#",
                  "Name",
                  "Species",
                  "Breed",
                  "Age",
                  "Gender",
                  "Weight (kg)",
                  "Notes",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 sm:px-6 py-3 border-b border-gray-300 text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {petList.map((pet, index) => (
                <tr
                  key={pet.id}
                  className="cursor-pointer hover:bg-[#DCE3FF] transition-colors duration-300 border-b border-gray-200"
                  onClick={() => openBookingModal(pet)}
                >
                  <td className="px-4 sm:px-6 py-3 text-center font-semibold text-sm sm:text-base">
                    {index + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base">
                    {pet.name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 capitalize text-sm sm:text-base">
                    {pet.species}
                  </td>
                  <td className="px-4 sm:px-6 py-3 capitalize text-sm sm:text-base">
                    {pet.breed}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center text-sm sm:text-base">
                    {pet.age}
                  </td>
                  <td className="px-4 sm:px-6 py-3 capitalize text-center text-sm sm:text-base">
                    {pet.gender}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center text-sm sm:text-base">
                    {pet.weight_kg}
                  </td>
                  <td className="px-4 sm:px-6 py-3 italic text-gray-500 max-w-xs truncate text-sm sm:text-base">
                    {pet.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-12 text-gray-600 px-4 sm:px-0">
          <p className="text-xl sm:text-2xl font-semibold">
            😿 No pets found in your profile.
          </p>
          <p className="mt-3 text-lg sm:text-xl">
            Please{" "}
            <span
              onClick={openAddPetModal}
              className="text-[#4F5D9B] font-semibold cursor-pointer underline hover:text-[#3B4371]"
            >
              add a pet
            </span>{" "}
            to get started.
          </p>
          <button
            onClick={openAddPetModal}
            className="mt-6 text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-500 text-white px-8 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            + Add Pet
          </button>
        </div>
      )}
      {showAddPetModal && (
        <AddPetModal
          onClose={() => setShowAddPetModal(false)}
          onPetAdded={() => {
            fetchPetList();
            setShowAddPetModal(false);
          }}
        />
      )}
    </div>
  );
}

export default PetListForBooking;
