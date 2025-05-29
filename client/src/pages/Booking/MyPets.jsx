import React, { useEffect, useState } from "react";
import axios from "axios";
import CancelConfirm from "./CancelConfirm";
import EditPetModal from "./EditPetModal";
import AddPetModal from "./AddPetModal"; // import modal thêm pet
import { FaPaw } from "react-icons/fa";

const MyPet = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // trạng thái hiện modal thêm pet

  const userData = JSON.parse(localStorage.getItem("user_info") || "null");

  useEffect(() => {
    if (!userData?.id) return;

    axios
      .get(`http://localhost:8000/api/user/${userData.id}/userpets`)
      .then((response) => {
        setPets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pets:", error);
        setLoading(false);
      });
  }, [userData]);

  const handleDelete = (id) => {
    setConfirmId(id);
  };

  const confirmDelete = () => {
    setIsDeleting(true);

    axios
      .delete(`http://localhost:8000/api/pets/${confirmId}`)
      .then(() => {
        setPets((prev) => prev.filter((p) => p.id !== confirmId));
        setSuccessMessage("Pet deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        setConfirmId(null);
        setIsDeleting(false);
      })
      .catch((err) => {
        alert("Failed to delete pet.");
        console.error(err);
        setIsDeleting(false);
      });
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setShowEditModal(true);
  };

  const handlePetUpdated = (updatedPet) => {
    setPets((prevPets) =>
      prevPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
    );
    setSuccessMessage("Pet updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    setShowEditModal(false);
  };

  // Hàm xử lý khi thêm pet thành công
  const handleAddPet = (newPet) => {
    setPets((prevPets) => [...prevPets, newPet]);
    setSuccessMessage("Pet added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen w-full max-w-[1280px] px-4 py-20 mx-auto">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4F5BA6] flex items-center justify-center gap-4 mb-4">
          <FaPaw className="text-4xl sm:text-5xl" />
          My Pets
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 text-lg sm:text-xl"
        >
          Add Pet
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 text-center">
          <span className="inline-block px-6 py-3 bg-green-100 text-green-800 text-lg rounded-lg font-semibold shadow-sm">
            {successMessage}
          </span>
        </div>
      )}

      {loading ? (
        <p className="text-lg sm:text-xl text-gray-600 text-center font-semibold">
          Loading pets...
        </p>
      ) : pets.length === 0 ? (
        <p className="text-lg sm:text-xl text-gray-500 text-center font-semibold">
          No pets found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-2xl rounded-3xl">
          <table className="min-w-full text-base sm:text-lg text-left text-gray-700">
            <thead className="bg-indigo-100 text-indigo-900 uppercase text-sm sm:text-base font-semibold">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Name</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Species</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Breed</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Weight(kg)</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Age</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Notes</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                  Edit Pet
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                  Delete Pet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {pets.map((pet) => (
                <tr
                  key={pet.id}
                  className="hover:bg-indigo-50 transition duration-200"
                >
                  <td className="px-4 sm:px-6 py-4">{pet.name || "Unknown"}</td>
                  <td className="px-4 sm:px-6 py-4">{pet.species || "-"}</td>
                  <td className="px-4 sm:px-6 py-4">{pet.breed || "-"}</td>
                  <td className="px-4 sm:px-6 py-4">{pet.weight_kg || "-"}</td>
                  <td className="px-4 sm:px-6 py-4">{pet.age || "-"}</td>
                  <td className="px-4 sm:px-6 py-4">{pet.notes || "-"}</td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(pet)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:text-yellow-100 px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-semibold shadow-md transition"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="bg-red-400 hover:bg-red-500 text-red-900 hover:text-red-100 px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-semibold shadow-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmId && (
        <CancelConfirm
          message="Are you sure you want to delete this pet?"
          onConfirm={confirmDelete}
          onCancel={() => {
            if (!isDeleting) setConfirmId(null);
          }}
          isLoading={isDeleting}
        />
      )}

      {showEditModal && selectedPet && (
        <EditPetModal
          pet={selectedPet}
          onClose={() => setShowEditModal(false)}
          onPetUpdated={handlePetUpdated}
        />
      )}

      {showAddModal && (
        <AddPetModal
          onClose={() => setShowAddModal(false)}
          onPetAdded={handleAddPet}
          userId={userData?.id}
        />
      )}
    </div>
  );
};

export default MyPet;
