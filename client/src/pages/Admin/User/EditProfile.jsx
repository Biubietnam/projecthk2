import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "../../../components/Button";
import { UserCog, Edit3, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef();

  const fetchProfile = useCallback( async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`http://localhost:8000/api/admin/users/${id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.profile);
      setAvatarPreview(res.data.profile.avatar_url);
    } catch (err) {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [id]);

    useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("upload_preset", "petzone");
    formData.set("folder", `Petzone/Users/${id}/Avatar`);
    const res = await axios.post("https://api.cloudinary.com/v1_1/dpwlgnop6/image/upload", formData);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadToCloudinary(avatarFile);
      }

      const payload = { ...profile, avatar_url: avatarUrl };

      await axios.put(`http://localhost:8000/api/admin/users/${id}/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Profile updated successfully!");
      navigate(`/admin/usermanagement`);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  if (loading || !profile) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen w-full px-4 max-w-screen-lg mx-auto text-gray-700 py-10 mt-10">
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
        <Link to="/admin/usermanagement" className="inline-flex items-center text-sm text-customPurple hover:underline">
          ← Back to User Management
        </Link>
      </div>

      <div className="relative w-full flex items-center justify-center mb-6">
        <Edit3 className="absolute left-0 w-6 h-6 text-customPurple" />
        <h1 className="text-3xl text-center">Edit Profile</h1>
        <UserCog className="absolute right-0 w-6 h-6 text-customPurple" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 gap-6">
        <Input label="Full Name" name="full_name" value={profile.full_name} onChange={handleChange} />
        <Select label="Gender" name="gender" value={profile.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
        <Input label="Date of Birth" name="date_of_birth" type="date" value={profile.date_of_birth} onChange={handleChange} />
        <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
        <Input label="Address" name="address" value={profile.address} onChange={handleChange} />
        <Input label="City" name="city" value={profile.city} onChange={handleChange} />
        <Input label="Country" name="country" value={profile.country} onChange={handleChange} />

        <div className="flex flex-col">
          <p className="text-sm text-gray-600 mb-1">Avatar</p>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-dashed border-2 border-gray-300 rounded-md p-4 bg-gray-100 cursor-pointer hover:border-customPurple text-center"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {avatarPreview ? (
              <div className="relative w-fit mx-auto">
                <img src={avatarPreview} alt="Avatar Preview" className="h-32 w-32 object-cover rounded shadow" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAvatar();
                  }}
                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Click or drop image to upload avatar</p>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <Button type="submit" className="w-full">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
      >
        <option value="">Select...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}