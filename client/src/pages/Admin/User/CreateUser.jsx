import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserPlus } from "lucide-react";
import Button from "../../../components/Button";

export default function CreateUser() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        role_id: 5,
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            await axios.post("http://localhost:8000/api/admin/users", user, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("User created successfully!");
            navigate("/admin/user-management");
        } catch (err) {
            alert("Failed to create user.");
        }
    };

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

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Create New User</h1>
                <UserPlus className="text-customPurple w-6 h-6" />
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 gap-6">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <input
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <input
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Role</p>
                    <select
                        name="role_id"
                        value={user.role_id}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
                    >
                        <option value={1}>Admin</option>
                        <option value={2}>Staff</option>
                        <option value={3}>Vet</option>
                        <option value={4}>Seller</option>
                        <option value={5}>User</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Password</p>
                    <input
                        name="password"
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">Confirm Password</p>
                    <input
                        name="password_confirmation"
                        type="password"
                        value={user.password_confirmation}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-customPurple"
                        required
                    />
                </div>

                <div className="text-center mt-4">
                    <Button type="submit" className="w-full">
                        Create User
                    </Button>
                </div>
            </form>
        </div>
    );
}
