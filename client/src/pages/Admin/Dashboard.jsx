import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user_info"));

    useEffect(() => {
        if (!user || user.role?.name !== "admin") {
            navigate("/");
        }
    }, []);

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                    <h2 className="text-xl font-semibold mb-2">Users</h2>
                    <p className="text-gray-600">Manage registered users.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                    <h2 className="text-xl font-semibold mb-2">Orders</h2>
                    <p className="text-gray-600">Track and manage orders.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                    <h2 className="text-xl font-semibold mb-2">Products</h2>
                    <p className="text-gray-600">Manage product listings.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                    <h2 className="text-xl font-semibold mb-2">Pets</h2>
                    <p className="text-gray-600">Manage pet information.</p>
                </div>
            </div>
        </div>
    );
}
