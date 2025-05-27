//Thuc
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PetManagement() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/pets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/admin/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(pets.filter((pet) => pet.id !== id));
    } catch (err) {
      console.error("Error deleting pet:", err);
      alert("Failed to delete pet.");
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

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
        <h1 className="text-3xl ">Pet Management</h1>
        <Link to="/admin/pets/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Add New Pet
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Breed</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Fee</th>
              <th className="p-4">Tags</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : pets.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No pets found.
                </td>
              </tr>
            ) : (
              pets.map((pet) => (
                <tr key={pet.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{pet.id}</td>
                  <td className="p-4">{pet.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs
      ${pet.type === 'Dogs' ? 'bg-yellow-100 text-yellow-800'
                          : pet.type === 'Cats' ? 'bg-purple-100 text-purple-800'
                            : pet.type === 'Rodents' ? 'bg-green-100 text-green-800'
                              : pet.type === 'Reptiles' ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {pet.type}
                    </span>
                  </td>
                  <td className="p-4">{pet.breed}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs inline-block ${pet.gender === 'Male'
                        ? 'bg-blue-100 text-blue-800'
                        : pet.gender === 'Female'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {pet.gender === 'Male' ? '♂ M' : '♀ F'}
                    </span>
                  </td>
                  <td className="p-4">${pet.adoptionFee}</td>
                  <td className="p-4">
                    {Array.isArray(pet.tags)
                      ? pet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2 mb-2"
                        >
                          {tag}
                        </span>
                      ))
                      : null}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/pets/edit/${pet.id}`}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(pet.id)}
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
