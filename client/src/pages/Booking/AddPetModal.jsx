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
  const [useManualBreed, setUseManualBreed] = useState(false); // Cho phép nhập thủ công

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setUseManualBreed(false); // reset nhập thủ công khi species thay đổi
        if (formData.species === "Dog") {
          const res = await axios.get("https://api.thedogapi.com/v1/breeds");
          setBreedList(res.data.map((item) => item.name));
        } else if (formData.species === "Cat") {
          const res = await axios.get("https://api.thecatapi.com/v1/breeds");
          setBreedList(res.data.map((item) => item.name));
        } else {
          setBreedList([]);
          setUseManualBreed(true); // tự động cho nhập thủ công nếu loài không có API breed
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
      .post("http://localhost:8000/api/userpets", submitData)
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

      <div className="bg-white p-6 rounded-xl shadow-lg z-50 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Add New Pet</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Pet Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <select
            name="species"
            onChange={handleChange}
            value={formData.species}
            required
            className="w-full border rounded px-3 py-2"
          >
            {speciesList.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>

          {/* Breed selector or manual input */}
          {!useManualBreed && breedList.length > 0 && (
            <>
              <select
                name="breed"
                onChange={handleChange}
                value={formData.breed}
                required
                className="w-full border rounded px-3 py-2"
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
                className="text-sm text-blue-600 hover:underline"
              >
                Can't find breed? Enter manually
              </button>
            </>
          )}

          {(useManualBreed || breedList.length === 0) && (
            <>
              <input
                name="breed"
                placeholder="Enter breed manually"
                value={formData.breed}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              {!useManualBreed && breedList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseManualBreed(false)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Select breed from list
                </button>
              )}
            </>
          )}

          <select
            name="gender"
            onChange={handleChange}
            value={formData.gender}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>

          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min={0}
          />

          <input
            name="weight_kg"
            type="number"
            placeholder="Weight (kg)"
            value={formData.weight_kg}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            step="0.1"
            min={0}
          />

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Pet
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
