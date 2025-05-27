//Thuc
import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { PawPrint, Trash2 } from "lucide-react";
import Button from "../../../components/Button";
import { Loader } from "lucide-react";

export default function CreatePet() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const mainInputRef = useRef();
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

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
  });

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleImages = (files) => {
    const fileArr = Array.from(files);
    const total = images.length + fileArr.length;
    if (total > 5) return alert("Only up to 5 images are allowed.");

    const allowed = fileArr.slice(0, 5 - images.length);
    const previews = allowed.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...allowed]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleImageChange = (e) => handleImages(e.target.files);
  const handleImageDrop = (e) => {
    e.preventDefault();
    handleImages(e.dataTransfer.files);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMainImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveNewImage = (index) => {
    const updated = [...images];
    const previews = [...imagePreviews];
    updated.splice(index, 1);
    previews.splice(index, 1);
    setImages(updated);
    setImagePreviews(previews);
  };

  const uploadToCloudinary = async (file, folder) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("upload_preset", "petzone");
    formData.set("folder", folder);

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dpwlgnop6/image/upload",
      formData
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const petId = Date.now();
      const mainFolder = `Petzone/Pets/${petId}/Main_image`;
      const galleryFolder = `Petzone/Pets/${petId}`;

      let mainImageUrl = "";
      if (mainImage) {
        mainImageUrl = await uploadToCloudinary(mainImage, mainFolder);
      }

      const galleryUrls = [];
      for (const img of images) {
        const url = await uploadToCloudinary(img, galleryFolder);
        galleryUrls.push(url);
      }

      const tagsArray = pet.tags ? pet.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];

      const payload = {
        ...pet,
        tags: tagsArray,
        images: galleryUrls,
        main_image: mainImageUrl,
      };

      await axios.post("http://localhost:8000/api/admin/pets", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Pet created successfully!");
      navigate("/admin/petmanagement");
    } catch (err) {
      console.error(err);
      alert("Failed to create pet: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { label: "Name", name: "name", required: true },
    { label: "Breed", name: "breed" },
    { label: "Age", name: "age" },
    { label: "Weight", name: "weight" },
    { label: "Color", name: "color" },
    { label: "Adoption Fee", name: "adoptionFee", type: "numberic", min: 0, step: 0.01 },
  ];

  const textareaFields = [
    { label: "Description", name: "description" },
    { label: "Diet Care", name: "careDiet" },
    { label: "Exercise Care", name: "careExercise" },
    { label: "Grooming Care", name: "careGrooming" },
  ];

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
        <h1 className="text-3xl ">Create New Pet</h1>
        <PawPrint className="text-customPurple w-6 h-6" />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
          {inputFields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{field.label}</p>
              <input
                name={field.name}
                type={field.type || "text"}
                min={field.min}
                value={pet[field.name]}
                onChange={handleChange}
                required={field.required}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
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

          {textareaFields.map((field) => (
            <div key={field.name} className="md:col-span-2 flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{field.label}</p>
              <textarea
                name={field.name}
                value={pet[field.name]}
                onChange={handleChange}
                rows={2}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
              />
            </div>
          ))}

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">Main Image (required)</p>
              <div
                onDrop={handleMainImageDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => mainInputRef.current.click()}
                className="border-dashed border-2 border-gray-300 rounded-md p-4 bg-gray-100 cursor-pointer hover:border-customPurple text-center"
              >
                <input
                  type="file"
                  ref={mainInputRef}
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
                {mainImagePreview ? (
                  <div className="relative inline-block">
                    <img src={mainImagePreview} alt="Main" className="h-32 mx-auto object-cover rounded shadow" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainImage(null);
                        setMainImagePreview(null);
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white text-gray-600"
                      title="Remove Main Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Click to select main image</p>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">Gallery Images (Max 5)</p>
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current.click()}
                className="border-dashed border-2 border-gray-300 rounded-md p-4 bg-gray-100 cursor-pointer hover:border-customPurple"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreviews.length === 0 && (
                  <p className="text-gray-500 text-sm text-center mt-2">Drag & drop or click to upload</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <img src={src} className="h-24 w-24 object-cover rounded shadow" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveNewImage(idx);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white text-gray-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin w-4 h-4" />
                  Creating...
                </span>
              ) : (
                "Create Pet"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
