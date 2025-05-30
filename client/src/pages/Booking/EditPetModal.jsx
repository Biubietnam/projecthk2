import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessPopup from "./SuccessPopUp";
import { FaSpinner } from "react-icons/fa";

const EditPetModal = ({ pet, onClose, onPetUpdated }) => {
  const speciesList = ["Dog", "Cat", "Reptile", "Rodent"];

  const [formData, setFormData] = useState({ ...pet });
  const [breedList, setBreedList] = useState([]);
  const [useManualBreed, setUseManualBreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        if (formData.species === "Dog") {
          const res = await axios.get("https://api.thedogapi.com/v1/breeds");
          setBreedList(res.data.map((item) => item.name));
          setUseManualBreed(false);
        } else if (formData.species === "Cat") {
          const res = await axios.get("https://api.thecatapi.com/v1/breeds");
          setBreedList(res.data.map((item) => item.name));
          setUseManualBreed(false);
        } else {
          setBreedList([]);
          setUseManualBreed(true);
        }
      } catch (error) {
        setBreedList([]);
        setUseManualBreed(true);
        console.error("Error fetching breeds:", error);
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
    if (!formData.name.trim()) return alert("Please enter the pet's name.");
    if (!formData.breed.trim()) return alert("Please enter the breed.");
    if (
      formData.age !== "" &&
      (isNaN(formData.age) || Number(formData.age) < 0)
    )
      return alert("Age must be a non-negative number.");
    if (
      formData.weight_kg !== "" &&
      (isNaN(formData.weight_kg) || Number(formData.weight_kg) < 0)
    )
      return alert("Weight must be a non-negative number.");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUpdating(true);

    const updateData = {
      ...formData,
      age: formData.age === "" ? null : Number(formData.age),
      weight_kg:
        formData.weight_kg === "" ? null : parseFloat(formData.weight_kg),
    };

    axios
      .put(`https://thoriumstudio.xyz/api/userpets/${formData.id}`, updateData)
      .then((res) => {
        onPetUpdated(res.data.data);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update pet.");
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl z-50 w-full max-w-lg p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-600 hover:text-red-500 text-3xl font-bold leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-extrabold mb-6 text-center text-indigo-700">
          Edit Pet
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-lg">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-gray-700 font-medium"
            >
              Pet Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Pet Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="species"
              className="block mb-1 text-gray-700 font-medium"
            >
              Species
            </label>
            <select
              id="species"
              name="species"
              onChange={handleChange}
              value={formData.species}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              {speciesList.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          {/* Breed selector or manual input */}
          {!useManualBreed && breedList.length > 0 && (
            <div>
              <label
                htmlFor="breed-select"
                className="block mb-1 text-gray-700 font-medium"
              >
                Breed
              </label>
              <select
                id="breed-select"
                name="breed"
                onChange={handleChange}
                value={formData.breed}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
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
                className="text-sm text-indigo-600 hover:underline mt-1"
              >
                Can't find breed? Enter manually
              </button>
            </div>
          )}

          {(useManualBreed || breedList.length === 0) && (
            <div>
              <label
                htmlFor="breed-manual"
                className="block mb-1 text-gray-700 font-medium"
              >
                Breed (Manual)
              </label>
              <input
                id="breed-manual"
                name="breed"
                placeholder="Enter breed manually"
                value={formData.breed}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
              {!useManualBreed && breedList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseManualBreed(false)}
                  className="text-sm text-indigo-600 hover:underline mt-1"
                >
                  Select breed from list
                </button>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="gender"
              className="block mb-1 text-gray-700 font-medium"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              onChange={handleChange}
              value={formData.gender}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="age"
              className="block mb-1 text-gray-700 font-medium"
            >
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              placeholder="Age"
              value={formData.age || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              min={0}
            />
          </div>

          <div>
            <label
              htmlFor="weight_kg"
              className="block mb-1 text-gray-700 font-medium"
            >
              Weight (kg)
            </label>
            <input
              id="weight_kg"
              name="weight_kg"
              type="number"
              placeholder="Weight (kg)"
              value={formData.weight_kg || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              min={0}
              step="any"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-1 text-gray-700 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full py-3 mt-2 text-xl font-semibold rounded-lg text-white ${
              isUpdating
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } transition`}
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                Updating <FaSpinner className="animate-spin" />
              </span>
            ) : (
              "Update Pet"
            )}
          </button>
        </form>

        {showSuccess && (
          <SuccessPopup
            title="Success"
            content="Pet information updated successfully"
            onClose={() => {
              setShowSuccess(false);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EditPetModal;
