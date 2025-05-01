//Thuc
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user_info"));
    useEffect(() => {
        if (!user || user.role?.name !== "admin") {
            navigate("/");
        }
    }, []);

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
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-4">{user.id}</td>
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.role?.name}</td>
                                <td className="p-4 space-x-2">
                                    <button className="text-blue-600 hover:underline">Edit</button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
