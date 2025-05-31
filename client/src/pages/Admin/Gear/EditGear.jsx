import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Wrench, Trash2 } from "lucide-react";
import Button from "../../../components/Button";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function EditGear() {
    const { id } = useParams();
    const [gear, setGear] = useState(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef();
    const mainInputRef = useRef();

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [existingMainImage, setExistingMainImage] = useState(null);

    const fetchGear = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            const res = await axios.get(`http://localhost:8000/api/gears/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGear({
                ...res.data,
                highlights: res.data.highlights?.join(", ") || "",
                images: [],
            });
            setExistingImages(res.data.images || []);
            setExistingMainImage(res.data.main_image || "");
            console.log("Fetched gear data:", res.data);
        } catch (err) {
            toast.error("Failed to load gear.");
            console.error("Error fetching gear:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchGear();
    }, [fetchGear]);

    const handleChange = (e) => {
        setGear({ ...gear, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const total = (gear.images?.length || 0) + newFiles.length;
        if (total > 5) return toast.error("Only up to 5 images are allowed.");

        const allowed = newFiles.slice(0, 5 - (gear.images?.length || 0));
        const newPreviews = allowed.map((file) => URL.createObjectURL(file));

        setImages(allowed);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const total = (gear.images?.length || 0) + files.length;
        if (total > 5) return toast.error("Only up to 5 images are allowed.");

        const allowed = files.slice(0, 5 - (gear.images?.length || 0));
        const newPreviews = allowed.map((file) => URL.createObjectURL(file));

        setImages(allowed);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
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

    const handleRemoveNewImage = (index) => {
        const updatedFiles = [...images];
        const updatedPreviews = [...imagePreviews];
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setImages(updatedFiles);
        setImagePreviews(updatedPreviews);
    };

    const handleRemoveExistingImage = (index) => {
        const updated = [...existingImages];
        updated.splice(index, 1);
        setExistingImages(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gear.name || !gear.price || !gear.category || (!mainImage && !existingMainImage)) {
            toast.error("Please fill out all required fields and upload a main image.");
            return;
        }

        if (gear.rating && (gear.rating < 0 || gear.rating > 5)) {
            toast.error("Rating must be between 0 and 5.");
            return;
        }

        if (
            (mainImage && mainImage.size > 10 * 1024 * 1024) ||
            images.some(img => img.size > 10 * 1024 * 1024)
        ) {
            toast.error("Each image must be under 10MB.");
            return;
        }

        toast(
            (t) => (
                <div className="text-sm">
                    <p>Are you sure you want to update this gear?</p>
                    <div className="flex gap-2 mt-3">
                        <button
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={() => {
                                toast.dismiss(t.id);
                                submitUpdate();
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
            ),
            { duration: 10000 }
        );
    };

    const submitUpdate = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            const gearId = id;

            const mainFolder = `Petzone/Gears/${gearId}/Main_image`;
            const galleryFolder = `Petzone/Gears/${gearId}`;

            let mainImageUrl = gear.main_image || existingMainImage || "";
            if (mainImage && mainImage !== existingMainImage) {
                mainImageUrl = await uploadToCloudinary(mainImage, mainFolder);
            }

            const galleryUrls = [];
            for (const img of images || []) {
                const url = await uploadToCloudinary(img, galleryFolder);
                galleryUrls.push(url);
            }

            const highlightsArray = gear.highlights
                ? gear.highlights.split(",").map(h => h.trim()).filter(Boolean)
                : [];

            const payload = {
                ...gear,
                highlights: highlightsArray,
                images: [...existingImages, ...galleryUrls],
                main_image: mainImageUrl
            };

            console.log("Sending JSON Payload:", JSON.stringify(payload, null, 2));

            await axios.put(`http://localhost:8000/api/admin/gears/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Gear updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update gear. Please try again.");
        } finally {
            setLoading(false);
        }
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

    return (loading || !gear) ? (
        <div className="w-full flex justify-center items-center py-20">
            <Loader className="w-6 h-6 animate-spin text-customPurple" />
        </div>
    ) : (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10"
        >
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
                <h1 className="text-3xl ">Edit Gear</h1>
                <Wrench className="text-customPurple w-6 h-6" />
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
                    {[
                        { label: "Name", name: "name" },
                        { label: "Category", name: "category" },
                        { label: "Price ($)", name: "price", type: "number" },
                        { label: "Sale Percent (%)", name: "sale_percent", type: "number", min: 0, max: 100, step: 1, placeholder: "e.g. 20" },
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
                                value={gear[field.name] || ""}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-customPurple shadow-sm transition"
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
                            className="appearance-none bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-customPurple"
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
                            className="appearance-none bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-customPurple"
                        >
                            <option value={0}>No</option>
                            <option value={1}>Yes</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm text-gray-600 mb-1">Is New?</p>
                        <select
                            name="is_new"
                            value={gear.is_new}
                            onChange={handleChange}
                            className="appearance-none bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-customPurple"
                        >
                            <option value={0}>No</option>
                            <option value={1}>Yes</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex flex-col">
                        <p className="text-sm text-gray-600 mb-1">Highlights (comma-separated)</p>
                        <input
                            name="highlights"
                            value={gear.highlights || ""}
                            onChange={handleChange}
                            placeholder="e.g. Water-resistant, Lightweight"
                            className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-customPurple shadow-sm transition"
                        />
                    </div>

                    {[
                        { label: "Shipping Info", name: "shipping_info", rows: 2 },
                        { label: "Return Policy", name: "return_policy", rows: 2 },
                        { label: "Description", name: "description", rows: 3 },
                        { label: "Details", name: "details", rows: 3 },
                    ].map((field) => (
                        <div key={field.name} className="md:col-span-2 flex flex-col">
                            <p className="text-sm text-gray-600 mb-1">{field.label}</p>
                            <textarea
                                name={field.name}
                                value={gear[field.name] || ""}
                                onChange={handleChange}
                                rows={field.rows}
                                className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-customPurple shadow-sm transition"
                            />
                        </div>
                    ))}

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <p className="text-sm text-gray-600 mb-1">
                                Main Image <span className="text-red-500">*</span>
                            </p>
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
                                {mainImagePreview || existingMainImage ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={mainImagePreview || existingMainImage}
                                            alt="Main"
                                            className="h-32 mx-auto object-cover rounded shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExistingMainImage(null);
                                                setMainImage(null);
                                                setMainImagePreview(null);
                                            }}
                                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition text-gray-600"
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
                                <div className="flex flex-wrap gap-4">
                                    {existingImages.map((url, idx) => (
                                        <div key={idx} className="relative group">
                                            <img src={url} alt={`Uploaded ${idx + 1}`} className="h-24 w-24 object-cover rounded shadow" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveExistingImage(idx);
                                                }}
                                                className="border-dashed border-2 border-gray-200 hover:border-customPurple hover:bg-purple-50 transition duration-150"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ))}
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} className="relative group">
                                            <img src={src} alt={`Uploaded ${idx + 1}`} className="h-24 w-24 object-cover rounded shadow" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveNewImage(idx);
                                                }}
                                                className="border-dashed border-2 border-gray-200 hover:border-customPurple hover:bg-purple-50 transition duration-150"
                                            >
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

                    <div className="md:col-span-2 text-center mt-4">
                        <Button
                            type="submit"
                            className="bg-customPurple text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg hover:bg-purple-600 active:scale-[.98] transition duration-150"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader className="w-5 h-5 text-customPurple animate-spin-slow" />
                            ) : (
                                "Update Gear"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
