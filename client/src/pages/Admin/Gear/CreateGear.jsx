import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Wrench, Trash2 } from "lucide-react";
import Button from "../../../components/Button";

export default function CreateGear() {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [gear, setGear] = useState({
    name: "",
    price: "",
    category: "",
    slug: "",
    rating: "",
    stock: "",
    petType: "Dogs",
    is_featured: 0,
    highlights: "",
    shipping_info: "",
    return_policy: "",
    description: "",
    details: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setGear({ ...gear, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = gear.images.length + newFiles.length;
    if (total > 5) return alert("Only up to 5 images are allowed.");

    const allowed = newFiles.slice(0, 5 - gear.images.length);
    const newPreviews = allowed.map((file) => URL.createObjectURL(file));

    setGear({ ...gear, images: [...gear.images, ...allowed] });
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    const total = gear.images.length + dropped.length;
    if (total > 5) return alert("Only up to 5 images are allowed.");

    const allowed = dropped.slice(0, 5 - gear.images.length);
    const previews = allowed.map((file) => URL.createObjectURL(file));

    setGear({ ...gear, images: [...gear.images, ...allowed] });
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...gear.images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setGear({ ...gear, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      Object.entries({
        ...gear,
        highlights: gear.highlights.split(",").map((h) => h.trim()),
      }).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
        }
      });

      gear.images.forEach((file) => {
        formData.append("images[]", file);
      });

      await axios.post("http://localhost:8000/api/admin/gears", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Gear created successfully!");
      navigate("/admin/gears");
    } catch (err) {
      alert("Failed to create gear.");
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <div className="mb-2">
        <Link
          to="/admin/gearmanagement"
          className="inline-flex items-center rounded text-sm text-customPurple hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Gear Management
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Gear</h1>
        <Wrench className="text-customPurple w-6 h-6" />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
          {[
            { label: "Name", name: "name" },
            { label: "Price ($)", name: "price", type: "number" },
            { label: "Category", name: "category" },
            { label: "Slug", name: "slug", placeholder: "auto-generated if left blank" },
            { label: "Rating", name: "rating", type: "number", step: "0.1", max: "5" },
            { label: "Stock", name: "stock", type: "number" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{field.label}</p>
              <input
                name={field.name}
                type={field.type || "text"}
                step={field.step}
                max={field.max}
                value={gear[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
                required={field.name === "name"}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Pet Type</p>
            <select
              name="petType"
              value={gear.petType}
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
            <p className="text-sm text-gray-600 mb-1">Is Featured?</p>
            <select
              name="is_featured"
              value={gear.is_featured}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Highlights (comma-separated)</p>
            <input
              name="highlights"
              value={gear.highlights}
              onChange={handleChange}
              placeholder="e.g. Waterproof, Lightweight"
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
            />
          </div>

          {[ "shipping_info", "return_policy", "description", "details" ].map((name) => (
            <div key={name} className="md:col-span-2 flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{name.replace("_", " ")}</p>
              <textarea
                name={name}
                value={gear[name]}
                onChange={handleChange}
                rows={3}
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

          <div className="md:col-span-2 text-center mt-4">
            <Button type="submit" className="w-full">
              Create Gear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
