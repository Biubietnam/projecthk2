import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { PawPrint, Trash2 } from "lucide-react";
import Button from "../../../components/Button";

export default function CreatePet() {
  const navigate = useNavigate();
  const [pet, setPet] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    color: "",
    adoptionFee: "",
    type: "Dogs",
    gender: "Male",
    tags: "",
    description: "",
    careDiet: "",
    careExercise: "",
    careGrooming: "",
    adopted: 0,
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalFiles = pet.images.length + newFiles.length;
    if (totalFiles > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    const allowedFiles = newFiles.slice(0, 5 - pet.images.length);
    const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));

    setPet({ ...pet, images: [...pet.images, ...allowedFiles] });
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const totalFiles = pet.images.length + droppedFiles.length;
    if (totalFiles > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    const allowedFiles = droppedFiles.slice(0, 5 - pet.images.length);
    const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));

    setPet({ ...pet, images: [...pet.images, ...allowedFiles] });
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...pet.images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setPet({ ...pet, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      Object.entries({
        ...pet,
        tags: pet.tags.split(",").map((tag) => tag.trim()),
      }).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
        }
      });

      pet.images.forEach((file) => {
        formData.append("images[]", file);
      });

      await axios.post(`http://localhost:8000/api/admin/pets`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Pet created successfully!");
      navigate("/admin/pets");
    } catch (err) {
      console.error(err);
      alert("Failed to create pet.");
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <div className="mb-2">
        <Link
          to="/admin/petmanagement"
          className="inline-flex items-center rounded text-sm text-customPurple hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Pet Management
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Pet</h1>
        <PawPrint className="text-customPurple w-6 h-6" />
      </div>

      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
          {[ "name", "breed", "age", "weight", "color", "adoptionFee" ].map((name) => (
            <div key={name} className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{name.charAt(0).toUpperCase() + name.slice(1)}</p>
              <input
                name={name}
                value={pet[name]}
                onChange={handleChange}
                type={name === "adoptionFee" ? "number" : "text"}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
                required={name === "name"}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Type</p>
            <select
              name="type"
              value={pet.type}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
            >
              <option>Dogs</option>
              <option>Cats</option>
              <option>Rodents</option>
              <option>Reptiles</option>
            </select>
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Gender</p>
            <select
              name="gender"
              value={pet.gender}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Tags (comma-separated)</p>
            <input
              name="tags"
              value={pet.tags}
              onChange={handleChange}
              placeholder="e.g. Available, Vaccinated, Neutered"
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
            />
          </div>

          {[ "description", "careDiet", "careExercise", "careGrooming" ].map((name) => (
            <div key={name} className="md:col-span-2 flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{name}</p>
              <textarea
                name={name}
                value={pet[name]}
                onChange={handleChange}
                rows={2}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
              />
            </div>
          ))}

          <div className="md:col-span-2 flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Upload Images (Max 5)</p>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-dashed border-2 border-gray-300 rounded-md p-4 bg-gray-100 cursor-pointer hover:border-customPurple"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreviews.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img src={src} className="h-24 w-24 object-cover rounded shadow" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition text-gray-600"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center">Drag & drop images here, or click to select</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Adopted</p>
            <select
              name="adopted"
              value={pet.adopted}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <Button type="submit" className="w-full">
              Create Pet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
