import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessPopup from "./SuccessPopUp";

const AddPetModal = ({ onClose, onPetAdded }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user_info") || "null");

  const speciesList = ["Dog", "Cat", "Reptile", "Rodent"];

  const [formData, setFormData] = useState({
    user_id: userData?.id || null,
    name: "",
    breed: "",
    age: "",
    gender: "Male",
    species: "Dog",
    weight_kg: "",
    notes: "",
  });

  const [breedList, setBreedList] = useState([]);
  const [useManualBreed, setUseManualBreed] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setUseManualBreed(false);
        if (formData.species === "Dog") {
          const res = await axios.get("https://api.thedogapi.com/v1/breeds");
          setBreedList(res.data.map((item) => item.name));
        } else if (formData.species === "Cat") {
          const res = await axios.get("https://api.thecatapi.com/v1/breeds");
          setBreedList(res.data.map((item) => item.name));
        } else {
          setBreedList([]);
          setUseManualBreed(true);
        }
        setFormData((prev) => ({ ...prev, breed: "" }));
      } catch (error) {
        setBreedList([]);
        setUseManualBreed(true);
        console.error("Failed to fetch breeds:", error);
      }
    };

    fetchBreeds();
  }, [formData.species]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter the pet's name.");
      return false;
    }
    if (!formData.breed.trim()) {
      alert("Please select or enter the breed.");
      return false;
    }
    if (
      formData.age !== "" &&
      (isNaN(formData.age) || Number(formData.age) < 0)
    ) {
      alert("Age must be a non-negative number.");
      return false;
    }
    if (
      formData.weight_kg !== "" &&
      (isNaN(formData.weight_kg) || Number(formData.weight_kg) < 0)
    ) {
      alert("Weight must be a non-negative number.");
      return false;
    }
    if (!speciesList.includes(formData.species)) {
      alert("Invalid species selected.");
      return false;
    }
    if (!["Male", "Female", "Unknown"].includes(formData.gender)) {
      alert("Invalid gender selected.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      ...formData,
      age: formData.age === "" ? null : Number(formData.age),
      weight_kg:
        formData.weight_kg === "" ? null : parseFloat(formData.weight_kg),
    };

    axios
      .post("https://thoriumstudio.xyz/api/userpets", submitData)
      .then((res) => {
        onPetAdded(res.data);
        setShowSuccess(true);
        setFormData({
          user_id: userData?.id || null,
          name: "",
          breed: "",
          age: "",
          gender: "Male",
          species: "Dog",
          weight_kg: "",
          notes: "",
        });
        setUseManualBreed(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          alert(
            "Validation Error: " + JSON.stringify(err.response.data.errors)
          );
        } else if (err.response && err.response.status === 401) {
          alert("Unauthorized: " + JSON.stringify(err.response.data.errors));
        } else {
          alert("An error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      <div className="bg-white p-8 rounded-2xl shadow-2xl z-50 w-full max-w-lg relative max-h-[85vh] overflow-y-auto border">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-extrabold mb-6 text-center text-[#4F5D9B]">
          🐾 Add New Pet
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 text-lg text-gray-700"
        >
          {/* Pet Name */}
          <div>
            <label className="block mb-1 font-medium">Pet Name</label>
            <input
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6D7AB5]"
              required
            />
          </div>

          {/* Species */}
          <div>
            <label className="block mb-1 font-medium">Species</label>
            <select
              name="species"
              onChange={handleChange}
              value={formData.species}
              required
              className="w-full border rounded-xl px-4 py-3"
            >
              {speciesList.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          {/* Breed */}
          <div>
            <label className="block mb-1 font-medium">Breed</label>
            {!useManualBreed && breedList.length > 0 ? (
              <>
                <select
                  name="breed"
                  onChange={handleChange}
                  value={formData.breed}
                  required
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="" disabled>
                    Select breed
                  </option>
                  {breedList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setUseManualBreed(true)}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  Can’t find breed? Enter manually
                </button>
              </>
            ) : (
              <>
                <input
                  name="breed"
                  placeholder="Enter breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3"
                  required
                />
                {breedList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseManualBreed(false)}
                    className="text-sm text-blue-600 hover:underline mt-1"
                  >
                    Select from list
                  </button>
                )}
              </>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              onChange={handleChange}
              value={formData.gender}
              required
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block mb-1 font-medium">Age</label>
            <input
              name="age"
              type="number"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
              min={0}
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block mb-1 font-medium">Weight (kg)</label>
            <input
              name="weight_kg"
              type="number"
              placeholder="Enter weight"
              value={formData.weight_kg}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
              step="0.1"
              min={0}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 font-medium">Notes (optional)</label>
            <textarea
              name="notes"
              placeholder="Any special notes..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#6D7AB5] hover:bg-[#5A6A9B] text-white py-3 rounded-full font-semibold text-lg shadow-md transition"
          >
            + Add Pet
          </button>

          {/* Success popup */}
          {showSuccess && (
            <SuccessPopup
              message="Thank you for adding your pet!"
              onClose={() => {
                onClose();
                setShowSuccess(false);
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};
export default AddPetModal;
