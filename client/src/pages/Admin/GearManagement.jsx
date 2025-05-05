//Thuc
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function GearManagement() {
    const [gears, setGears] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGears = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get("http://localhost:8000/api/gears", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGears(response.data);
        } catch (err) {
            console.error("Error fetching gears:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this gear?")) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://localhost:8000/api/admin/gears/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGears(gears.filter((gear) => gear.id !== id));
        } catch (err) {
            console.error("Error deleting gear:", err);
            alert("Failed to delete gear.");
        }
    };

    useEffect(() => {
        fetchGears();
    }, []);

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gear Management</h1>
                <Link to="/admin/gears/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Add New Gear
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Highlights</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">Loading...</td>
                            </tr>
                        ) : gears.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">No gears found.</td>
                            </tr>
                        ) : (
                            gears.map((gear) => (
                                <tr key={gear.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">{gear.id}</td>
                                    <td className="p-4">{gear.name}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${gear.petType === 'Dogs' ? 'bg-yellow-100 text-yellow-800'
                                                : gear.petType === 'Cats' ? 'bg-purple-100 text-purple-800'
                                                    : gear.petType === 'Rodents' ? 'bg-green-100 text-green-800'
                                                        : gear.petType === 'Reptiles' ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {gear.petType}
                                        </span>
                                    </td>
                                    <td className="p-4">{gear.category}</td>
                                    <td className="p-4">${gear.price}</td>
                                    <td className="p-4">
                                        {Array.isArray(gear.highlights)
                                            ? gear.highlights.map((h, i) => (
                                                <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 whitespace-nowrap">
                                                    {h}
                                                </span>
                                            ))
                                            : null}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/admin/gears/edit/${gear.id}`}
                                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(gear.id)}
                                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
