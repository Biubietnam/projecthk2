import React, { useEffect, useState } from "react";
import { useModal } from "../../Appwrapper";
import BookingModal from "./BookingModal";
import AddPetModal from "./AddPetModal";
import axios from "axios";

function PetListForBooking() {
  // Modal control: mở và đóng modal
  const { openModal, closeModal } = useModal();

  // State lưu danh sách thú cưng
  const [petList, setPetList] = useState([]);
  // State xác định user có pet hay không
  const [hasPet, setHasPet] = useState(false);

  /**
   * Hàm gọi modal đặt lịch cho pet
   */
  const openBookingModal = (pet) => {
    // Lưu pet đã chọn vào localStorage để modal BookingModal dùng
    localStorage.setItem("selectedPet", JSON.stringify(pet));
    openModal({
      body: <BookingModal onClose={closeModal} />,
    });
  };

  /**
   * Hàm gọi modal thêm pet mới
   */
  const openAddPetModal = () => {
    openModal({
      body: (
        <AddPetModal
          onClose={closeModal}
          onPetAdded={() => {
            // Sau khi thêm pet, fetch lại danh sách pet mới
            fetchPetList();
          }}
        />
      ),
    });
  };

  /**
   * Hàm lấy danh sách pet từ backend theo userId
   */
  const fetchPetList = () => {
    // Lấy userId từ localStorage
    const userDataString = localStorage.getItem("user_info");
    const userId = userDataString ? JSON.parse(userDataString).id : null;

    // Nếu chưa đăng nhập, thông báo và không fetch nữa
    if (!userId) {
      alert("Please log in to view your pet list.");
      return;
    }

    // Gọi API lấy pet list
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

  // Khi component mount, gọi fetchPetList
  useEffect(() => {
    fetchPetList();
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto">
      <h1 className="text-3xl text-center text-[#6D7AB5] mb-6">
        STEP 1: 🐶 Choose Your Pet to Serve
      </h1>

      {/* Nếu có pet, hiển thị bảng pet */}
      {hasPet ? (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full border text-sm text-gray-700 bg-white">
            <thead>
              <tr className="bg-[#F0F4FF] text-[#4A5A93] uppercase text-xs tracking-wider">
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
                  <th key={header} className="px-4 py-3 border">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {petList.map((pet, index) => (
                <tr
                  key={pet.id}
                  className="cursor-pointer hover:bg-[#E0E7FF] transition duration-200 relative overflow-hidden group"
                  onClick={() => openBookingModal(pet)}
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

          {/* Nút thêm pet */}
          <div className="flex justify-center py-4">
            <button
              onClick={openAddPetModal}
              className="bg-[#6D7AB5] text-white px-6 py-2 rounded hover:bg-[#5A6A9B] transition-colors"
            >
              Add More Pet
            </button>
          </div>
        </div>
      ) : (
        // Nếu không có pet nào, hiện thông báo và nút thêm pet
        <div className="text-center mt-8 text-gray-600">
          <p className="text-lg">😿 No pets found in your profile.</p>
          <p className="mt-2">
            Please{" "}
            <span
              onClick={openAddPetModal}
              className="text-blue-600 font-semibold cursor-pointer"
            >
              add a pet
            </span>{" "}
            to get started.
          </p>
          <button
            onClick={openAddPetModal}
            className="mt-4 bg-[#6D7AB5] text-white px-6 py-2 rounded hover:bg-[#5A6A9B] transition-colors"
          >
            Add Pet
          </button>
        </div>
      )}
    </div>
  );
}

export default PetListForBooking;
