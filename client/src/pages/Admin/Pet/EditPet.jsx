import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { PawPrint, Trash2, Loader } from "lucide-react";
import Button from "../../../components/Button";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingbutton, setLoadingButton] = useState(false);
  const fileInputRef = useRef();
  const mainInputRef = useRef();

  const [mainImage, setMainImage] = useState(null);
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchPet();
  }, []);

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
      const res = await axios.get(`https://thoriumstudio.xyz/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tags = res.data.tags?.join(", ") || "";
      setPet({ ...res.data, tags, images: [] });
      setExistingImages(res.data.images || []);
      setExistingMainImage(res.data.main_image || null);
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
    const total = (pet.images?.length || 0) + newFiles.length;
    if (total > 5) return alert("You can only upload a maximum of 5 images.");

    const allowed = newFiles.slice(0, 5 - (pet.images?.length || 0));
    const previews = allowed.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...allowed]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
      setExistingMainImage(null);
    }
  };

  const handleMainImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
      setExistingMainImage(null);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const total = (pet.images?.length || 0) + files.length;
    if (total > 5) return alert("Only up to 5 images are allowed.");
    const allowed = files.slice(0, 5 - (pet.images?.length || 0));
    const previews = allowed.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...allowed]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveNewImage = (index) => {
    const updated = [...images];
    const previews = [...imagePreviews];
    updated.splice(index, 1);
    previews.splice(index, 1);
    
    setImages(updated);
    setImagePreviews(previews);
  };

  const handleRemoveExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleSubmit = async (e) => {
    setLoadingButton(true);
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");

      const petId = id;
      const mainFolder = `Petzone/Pets/${petId}/Main_image`;
      const galleryFolder = `Petzone/Pets/${petId}`;

      let mainImageUrl = pet.main_image || existingMainImage || "";
      if (mainImage && mainImage !== existingMainImage) {
        mainImageUrl = await uploadToCloudinary(mainImage, mainFolder);
      }
      
      const galleryUrls = [];
      for (const img of images || []) {
        const url = await uploadToCloudinary(img, galleryFolder);
        galleryUrls.push(url);
      }

      const tagsArray = pet.tags ? pet.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];

      const payload = {
        ...pet,
        adoptionFee: parseFloat(pet.adoptionFee) || null,
        adopted: pet.adopted === "1" || pet.adopted === 1,
        tags: tagsArray,
        images: [...existingImages, ...galleryUrls],
        main_image: mainImageUrl,
      };

      console.log("Payload to send:", payload);

      await axios.put(`https://thoriumstudio.xyz/api/admin/pets/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Pet updated successfully!");
      navigate("/admin/petmanagement");
    } catch (err) {
      if (err.response?.status === 422) {
        console.log("Validation errors:", err.response.data.errors);
      }
      console.error(err);
      alert("Failed to update pet.");
    }
    finally {
      setLoadingButton(false);
    }
  };

  const uploadToCloudinary = async (file, folder) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("upload_preset", "petzone");
    formData.set("folder", folder);
    const res = await axios.post("https://api.cloudinary.com/v1_1/dpwlgnop6/image/upload", formData);
    return res.data.secure_url;
  };

  if (loading || !pet) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <div className="mb-2">
        <Link to="/admin/petmanagement" className="inline-flex items-center text-sm text-customPurple hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Pet Management
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl ">Edit Pet</h1>
        <PawPrint className="text-customPurple w-6 h-6" />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{ label: "Name", name: "name" }, { label: "Breed", name: "breed" }, { label: "Age", name: "age" }, { label: "Weight", name: "weight" }, { label: "Color", name: "color" }, { label: "Adoption Fee ($)", name: "adoptionFee", type: "number" }].map((f) => (
            <div key={f.name} className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{f.label}</p>
              <input name={f.name} type={f.type || "text"} value={pet[f.name] || ""} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple" required={f.name === "name"} />
            </div>
          ))}

          <div className="flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Type</p>
            <select name="type" value={pet.type} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple">
              <option>Dogs</option><option>Cats</option><option>Rodents</option><option>Reptiles</option>
            </select>
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Gender</p>
            <select name="gender" value={pet.gender} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple">
              <option>Male</option><option>Female</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Tags (comma-separated)</p>
            <input name="tags" value={pet.tags || ""} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple" />
          </div>

          {[{ label: "Description", name: "description" }, { label: "Care Diet", name: "careDiet" }, { label: "Care Exercise", name: "careExercise" }, { label: "Care Grooming", name: "careGrooming" }].map((f) => (
            <div key={f.name} className="md:col-span-2 flex flex-col">
              <p className="text-sm text-gray-600 mb-1">{f.label}</p>
              <textarea name={f.name} value={pet[f.name] || ""} onChange={handleChange} rows={2} className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple" />
            </div>
          ))}

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">Main Image (required)</p>
              <div onDrop={handleMainImageDrop} onDragOver={(e) => e.preventDefault()} onClick={() => mainInputRef.current.click()} className="border-dashed border-2 border-gray-300 rounded-md p-4 bg-gray-100 cursor-pointer hover:border-customPurple text-center">
                <input type="file" ref={mainInputRef} accept="image/*" onChange={handleMainImageChange} className="hidden" />
                {mainImagePreview || existingMainImage ? (
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="relative group">
                      <img
                        src={mainImagePreview || existingMainImage}
                        className="h-24 w-24 object-cover rounded shadow"
                        alt="Main"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainImage(null);
                          setMainImagePreview(null);
                          setExistingMainImage(null);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white text-gray-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center">Click to select main image</p>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 mb-1">Gallery Images (Max 5)</p>
              <div onDrop={handleImageDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current.click()} className="border-dashed border-2 border-gray-300 rounded-md p-4 bg-gray-100 cursor-pointer hover:border-customPurple">
                <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                <div className="flex flex-wrap gap-4">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} className="h-24 w-24 object-cover rounded shadow" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveExistingImage(i); }} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white text-gray-600">
                        ❌
                      </button>
                    </div>
                  ))}
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} className="h-24 w-24 object-cover rounded shadow" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveNewImage(i); }} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white text-gray-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {(existingImages.length + imagePreviews.length === 0) && (
                  <p className="text-gray-500 text-sm text-center mt-2">Drag & drop or click to upload</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-600 mb-1">Adopted</p>
            <select name="adopted" value={pet.adopted} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100">
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <Button type="submit" className="w-full" disabled={loadingbutton}>
              {loadingbutton ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin w-4 h-4" />
                  Updating...
                </span>
              ) : (
                "Update Pet"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
