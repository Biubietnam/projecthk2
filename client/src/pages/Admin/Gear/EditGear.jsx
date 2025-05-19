import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Wrench, Trash2 } from "lucide-react";

export default function EditGear() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gear, setGear] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const fileInputRef = useRef();
    const mainInputRef = useRef();
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);


    useEffect(() => {
        fetchGear();
    }, []);

    const fetchGear = async () => {
        try {
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
        } catch (err) {
            alert("Failed to load gear.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setGear({ ...gear, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const total = (gear.images?.length || 0) + newFiles.length;
        if (total > 5) return alert("Only up to 5 images are allowed.");
        const allowed = newFiles.slice(0, 5 - (gear.images?.length || 0));
        const newPreviews = allowed.map((file) => URL.createObjectURL(file));
        setGear({ ...gear, images: [...(gear.images || []), ...allowed] });
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const total = (gear.images?.length || 0) + files.length;
        if (total > 5) return alert("Only up to 5 images are allowed.");
        const allowed = files.slice(0, 5 - (gear.images?.length || 0));
        const newPreviews = allowed.map((file) => URL.createObjectURL(file));
        setGear({ ...gear, images: [...(gear.images || []), ...allowed] });
        setImagePreviews((prev) => [...prev, ...newPreviews]);
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
        const updatedFiles = [...gear.images];
        const updatedPreviews = [...imagePreviews];
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setGear({ ...gear, images: updatedFiles });
        setImagePreviews(updatedPreviews);
    };

    const handleRemoveExistingImage = (index) => {
        const updated = [...existingImages];
        updated.splice(index, 1);
        setExistingImages(updated);
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

            if (gear.images && gear.images.length > 0) {
                gear.images.forEach((file) => {
                    formData.append("images[]", file);
                });
            }

            if (existingImages.length > 0) {
                existingImages.forEach((url) => {
                    formData.append("existingImages[]", url);
                });
            }

            await axios.post(`http://localhost:8000/api/admin/gears/${id}?_method=PUT`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Gear updated successfully!");
            navigate("/admin/gears");
        } catch (err) {
            alert("Failed to update gear.");
        }
    };

    if (loading || !gear) return <div className="text-center py-20 text-gray-500">Loading...</div>;

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
                <h1 className="text-3xl font-bold">Edit Gear</h1>
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
                                value={gear[field.name] || ""}
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
                            value={gear.highlights || ""}
                            onChange={handleChange}
                            placeholder="e.g. Water-resistant, Lightweight"
                            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
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
                                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
                            />
                        </div>
                    ))}

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <img
                                            src={mainImagePreview}
                                            alt="Main"
                                            className="h-32 mx-auto object-cover rounded shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
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
                                onDrop={handleDrop}
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
                                            <img src={url} className="h-24 w-24 object-cover rounded shadow" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveExistingImage(idx);
                                                }}
                                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white text-gray-600"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ))}
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
                                {(existingImages.length + imagePreviews.length === 0) && (
                                    <p className="text-gray-500 text-sm text-center mt-2">Drag & drop or click to upload</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 text-center mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
