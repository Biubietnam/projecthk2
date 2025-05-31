import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Wrench, Trash2 } from "lucide-react";
import Button from "../../../components/Button";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function CreateGear() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const mainInputRef = useRef();
  const [loading, setLoading] = useState(false);

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
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const handleChange = (e) => {
    setGear({ ...gear, [e.target.name]: e.target.value });
  };

  const handleImages = (files) => {
    const fileArr = Array.from(files);
    const total = images.length + fileArr.length;
    if (total > 5) return toast.error("Only up to 5 images are allowed.");

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
    return {
      url: res.data.secure_url,
      public_id: res.data.public_id,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gear.name || !gear.price || !gear.category || !mainImage) {
      toast.error("Please fill out all required fields and upload a main image.");
      return;
    }

    if (gear.rating && (gear.rating < 0 || gear.rating > 5)) {
      toast.error("Rating must be between 0 and 5.");
      return;
    }

    if (mainImage.size > 10 * 1024 * 1024 || images.some(img => img.size > 10 * 1024 * 1024)) {
      toast.error("Each image must be under 10MB.");
      return;
    }

    toast((t) => (
      <div className="text-sm">
        <p>Are you sure you want to create this gear?</p>
        <div className="flex gap-2 mt-3">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              toast.dismiss(t.id);
              submitCreate();
            }}
          >
            Yes
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const submitCreate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const gearId = Date.now();
      const mainFolder = `Petzone/Gears/${gearId}/Main_image`;
      const galleryFolder = `Petzone/Gears/${gearId}`;

      const mainImageData = {
        url: "",
        public_id: "",
      };
      const galleryData = [];
      if (mainImage) {
        const uploadedMain = await uploadToCloudinary(mainImage, mainFolder);
        mainImageData.url = uploadedMain.url;
        mainImageData.public_id = uploadedMain.public_id;
      }

      for (const img of images) {
        const uploadedImg = await uploadToCloudinary(img, galleryFolder);
        galleryData.push({
          url: uploadedImg.url,
          public_id: uploadedImg.public_id,
        });
      }

      const highlightsArray = gear.highlights
        ? gear.highlights.split(",").map((h) => h.trim()).filter(Boolean)
        : [];

      const slugify = (text) =>
        text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      const payload = {
        ...gear,
        slug: gear.slug || slugify(gear.name),
        highlights: highlightsArray,
        main_image: mainImageData,
        images: galleryData,
      };

      await axios.post("http://localhost:8000/api/admin/gears", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Gear created successfully!");
      navigate("/admin/gearmanagement");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create gear: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { label: "Name", name: "name", required: true },
    { label: "Price ($)", name: "price", type: "number", min: 0, step: 0.01 },
    { label: "Category", name: "category" },
    { label: "Slug", name: "slug", placeholder: "auto-generated if left blank" },
    { label: "Rating", name: "rating", type: "number", step: "0.1", max: "5" },
    { label: "Stock", name: "stock", type: "number", min: 0 },
  ];

  const textareaFields = [
    { label: "Shipping Info", name: "shipping_info", rows: 2 },
    { label: "Return Policy", name: "return_policy", rows: 2 },
    { label: "Description", name: "description", rows: 3 },
    { label: "Details", name: "details", rows: 3 },
  ];

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#f9f9f9",
            color: "#333",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            fontSize: "14px",
            fontWeight: "500",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ECFDF5",
          },
        }}
      />
      <div className="mb-2">
        <Link to="/admin/gearmanagement" className="inline-flex items-center text-sm text-customPurple hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Gear Management
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl ">Create New Gear</h1>
        <Wrench className="text-customPurple w-6 h-6" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
          {inputFields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{field.label}</p>
              <input
                name={field.name}
                type={field.type || "text"}
                step={field.step}
                max={field.max}
                min={field.min}
                value={gear[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-customPurple transition"
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
              placeholder="e.g. Water-resistant, Lightweight"
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-customPurple transition"
            />
          </div>

          {textareaFields.map((field) => (
            <div key={field.name} className="md:col-span-2 flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{field.label}</p>
              <textarea
                name={field.name}
                rows={field.rows}
                value={gear[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-customPurple transition"
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
                      <img
                        src={src}
                        alt={`Gallery ${idx + 1}`}
                        className="h-24 w-full object-cover rounded shadow"
                      />
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

          <div className="md:col-span-2 text-center mt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin w-4 h-4" />
                  Creating...
                </span>
              ) : (
                "Create Gear"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div >
  );
}
