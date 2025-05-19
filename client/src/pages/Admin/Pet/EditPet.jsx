import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { PawPrint, Trash2 } from "lucide-react";
import Button from "../../../components/Button";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef();

  const fetchPet = async () => {
    const token = localStorage.getItem("user_info");
    const user = token ? JSON.parse(token) : null;

    if (!user || user.role.name !== "admin") {
      alert("You do not have permission to access this page.");
      navigate("/admin/dashboard");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`http://localhost:8000/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tags = res.data.tags?.join(", ") || "";

      setPet({ ...res.data, tags, images: [] });

      setExistingImages(res.data.images || []);

    } catch (err) {
      console.error("Failed to load pet", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    const totalFiles = (pet.images?.length || 0) + newFiles.length;
    if (totalFiles > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }
    const allowedFiles = newFiles.slice(0, 5 - (pet.images?.length || 0));

    const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));

    setPet({
      ...pet,
      images: [...(pet.images || []), ...allowedFiles],
    });

    setImagePreviews([
      ...imagePreviews,
      ...newPreviews,
    ]);
  };

  const handleRemoveNewImage = (index) => {
    const updatedFiles = [...pet.images];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setPet({ ...pet, images: updatedFiles });
    setImagePreviews(updatedPreviews);
  };

  const handleRemoveExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const totalFiles = (pet.images?.length || 0) + droppedFiles.length;
    if (totalFiles > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    const allowedFiles = droppedFiles.slice(0, 5 - (pet.images?.length || 0));
    const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));

    setPet({ ...pet, images: [...(pet.images || []), ...allowedFiles] });
    setImagePreviews(prev => [...prev, ...newPreviews]);
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

      if (pet.images && pet.images.length > 0) {
        Array.from(pet.images)
          .slice(0, 5)
          .forEach((file) => {
            formData.append("images[]", file);
          });
      }

      if (existingImages.length > 0) {
        existingImages.forEach((image) => {
          formData.append("existingImages[]", image);
        });
      }

      await axios.post(`http://localhost:8000/api/admin/pets/${id}?_method=PUT`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Pet updated successfully!");
      navigate("/admin/pets");
    } catch (err) {
      console.error(err);
      alert("Failed to update pet.");
    }
  };

  useEffect(() => {
    fetchPet();
  }, []);

  if (loading || !pet) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <div className="mb-2">
        <Link
          to="/admin/petmanagement"
          className="inline-flex items-center rounded text-sm text-customPurple hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-1 h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>

          Back to Pet Management
        </Link>
      </div >

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Pet</h1>
        <PawPrint className="text-customPurple w-6 h-6" />
      </div>

      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
          {[
            { label: "Name", name: "name" },
            { label: "Breed", name: "breed" },
            { label: "Age", name: "age" },
            { label: "Weight", name: "weight" },
            { label: "Color", name: "color" },
            { label: "Adoption Fee ($)", name: "adoptionFee", type: "number" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{field.label}</p>
              <input
                name={field.name}
                value={pet[field.name] || ''}
                onChange={handleChange}
                type={field.type || "text"}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
                required={field.name === "name"}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Type</p>
            <select
              name="type"
              value={pet.type}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
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
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Tags (comma-separated)</p>
            <input
              name="tags"
              value={pet.tags || ''}
              onChange={handleChange}
              placeholder="e.g. Available, Vaccinated, Neutered"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
            />
          </div>

          {[
            { label: "Description", name: "description" },
            { label: "Care Diet", name: "careDiet" },
            { label: "Care Exercise", name: "careExercise" },
            { label: "Care Grooming", name: "careGrooming" },
          ].map((field) => (
            <div key={field.name} className="md:col-span-2 flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{field.label}</p>
              <textarea
                name={field.name}
                value={pet[field.name] || ''}
                onChange={handleChange}
                rows={2}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
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

              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} className="h-24 w-24 object-cover rounded shadow" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveExistingImage(index);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition text-gray-600"
                        title="Remove"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img src={src} className="h-24 w-24 object-cover rounded shadow" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveNewImage(index);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition text-gray-600"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(existingImages.length === 0 && imagePreviews.length === 0) && (
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
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <Button
              type="submit"
              className="w-full"
            >
              Update Pet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
