// PetManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LayoutDashboard, Pencil, Trash2 } from "lucide-react";
import ReactApexChart from "react-apexcharts";

function PetDonutChart({ data }) {
  const grouped = data.reduce((acc, pet) => {
    acc[pet.type] = (acc[pet.type] || 0) + 1;
    return acc;
  }, {});

  const types = Object.keys(grouped);
  const series = Object.values(grouped);
  const total = series.reduce((a, b) => a + b, 0);

  const options = {
    chart: { type: "donut" },
    labels: types,
    colors: ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#A78BFA", "#3B82F6", "#F472B6", "#22D3EE"],
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (value, { w }) => {
          if (!w || !w.globals || !w.globals.seriesTotals) return value;
          const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value} pets (${percentage}%)`;
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => total
            }
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">Pets by Type</h2>
      <ReactApexChart key={data.length} options={options} series={series} type="donut" height={240} />
    </div>
  );
}

function PetBarChart({ data }) {
  const grouped = data.reduce((acc, pet) => {
    acc[pet.breed] = (acc[pet.breed] || 0) + 1;
    return acc;
  }, {});

  const breedData = Object.entries(grouped)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const options = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "60%"
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: breedData.map(b => b.name),
      labels: { style: { fontSize: "13px" } }
    },
    colors: ["#6366F1"],
    tooltip: {
      y: {
        formatter: (val) => `${val} pets`
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">Top 5 Breeds</h2>
      <ReactApexChart
        options={options}
        series={[{ name: "Pets", data: breedData.map(b => b.count) }]}
        type="bar"
        height={300}
      />
    </div>
  );
}

export default function PetManagement() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("https://thoriumstudio.xyz/api/pets", {
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
      await axios.delete(`https://thoriumstudio.xyz/api/admin/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets((prev) => prev.filter((pet) => pet.id !== id));
    } catch (err) {
      console.error("Error deleting pet:", err);
      alert("Failed to delete pet.");
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filtered = pets.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-8 text-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PetDonutChart data={pets} />
        <PetBarChart data={pets} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="text-customPurple hover:underline flex items-center gap-1"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple text-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pet Management</h1>
        <Link
          to="/admin/pets/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add New Pet
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">No pets found.</td>
              </tr>
            ) : (
              filtered.map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{pet.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${pet.type === "Dogs" ? "bg-yellow-100 text-yellow-800" :
                      pet.type === "Cats" ? "bg-purple-100 text-purple-800" :
                        pet.type === "Rodents" ? "bg-green-100 text-green-800" :
                          pet.type === "Reptiles" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                      }`}>
                      {pet.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{pet.breed}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${pet.gender === "Male" ? "bg-blue-100 text-blue-800" :
                      "bg-pink-100 text-pink-800"
                      }`}>
                      {pet.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4">${pet.adoptionFee}</td>
                  <td className="px-6 py-4">
                    {Array.isArray(pet.tags) && pet.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                    {pet.tags?.length > 2 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{pet.tags.length - 2} more
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex gap-2 justify-center">
                      <Link
                        to={`/admin/pets/edit/${pet.id}`}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition inline-flex items-center"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
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
