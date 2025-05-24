//Thuc
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user_info"));
    useEffect(() => {
        if (!user || user.role?.name !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get("http://localhost:8000/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(users.filter((u) => u.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };


    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <div className="mb-2">
                <Link
                    to="/admin/dashboard"
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

                    Back to Admin Dasboard
                </Link>
            </div >

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl ">User Management</h1>
                <Link to="/admin/users/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Add New User
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-200 rounded-t-lg">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-100 transition">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs capitalize inline-block ${user.role?.name === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.role?.name === 'staff' ? 'bg-blue-100 text-blue-800' :
                                                    user.role?.name === 'vet' ? 'bg-green-100 text-green-800' :
                                                        user.role?.name === 'seller' ? 'bg-yellow-100 text-yellow-800' :
                                                            user.role?.name === 'user' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {user.role?.name}
                                        </span>
                                    </td>
                                    <td className="p-4 space-x-2">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/users/edit/${user.id}`}
                                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
