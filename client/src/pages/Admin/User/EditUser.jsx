import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserCog } from "lucide-react";
import Button from "../../../components/Button";

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await axios.get(`http://localhost:8000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
        } catch (err) {
            alert("Failed to load user.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");

            await axios.post(`http://localhost:8000/api/admin/users/${id}?_method=PUT`, user, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("User updated successfully!");
            navigate("/admin/user-management");
        } catch (err) {
            alert("Failed to update user.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading || !user) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <div className="mb-2">
                <Link
                    to="/admin/usermanagement"
                    className="inline-flex items-center text-sm text-customPurple hover:underline"
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
                    Back to User Management
                </Link>
            </div>

            <div className="relative w-full flex items-center justify-center mb-6">
                <Link
                    to={`/admin/users/edit/profile/${user.id}`}
                    className="absolute left-0 px-4 py-2 text-sm text-white bg-customPurple hover:bg-customPurpleDark rounded-md transition"
                >
                    Edit Profile Info
                </Link>

                <h1 className="text-3xl  text-center">Edit User</h1>

                <UserCog className="absolute right-0 w-6 h-6 text-customPurple" />
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 gap-6">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <input
                        name="name"
                        value={user.name || ""}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <input
                        name="email"
                        type="email"
                        value={user.email || ""}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Role</p>
                    <select
                        name="role_id"
                        value={user.role_id}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
                    >
                        <option value={1}>Admin</option>
                        <option value={2}>Staff</option>
                        <option value={3}>Vet</option>
                        <option value={4}>Selleer</option>
                        <option value={5}>User</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Email Verified At</p>
                    <input
                        name="email_verified_at"
                        value={user.email_verified_at || ""}
                        readOnly
                        type="datetime-local"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Password (optional)</p>
                    <input
                        name="password"
                        type="password"
                        value={user.password || ""}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customPurple bg-gray-100"
                    />
                </div>

                <div className="text-center mt-4">
                    <Button type="submit" className="w-full">
                        Update User
                    </Button>
                </div>
            </form>
        </div>
    );
}
