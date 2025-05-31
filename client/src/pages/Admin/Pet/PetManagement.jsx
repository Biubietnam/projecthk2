// PetManagement.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LayoutDashboard, Pencil, Trash2 } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import toast, { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tableRef = useRef();
  const filtered = search.length > 100
    ? []
    : pets.filter((p) => {
      const keyword = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(keyword) ||
        p.breed?.toLowerCase().includes(keyword) ||
        p.type?.toLowerCase().includes(keyword)
      );
    });

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => Math.abs(p - currentPage) <= 2);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/pets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
      toast.error("Failed to fetch pets.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    toast((t) => (
      <span>
        Are you sure?
        <div className="mt-2 flex gap-2 justify-end">
          <button onClick={() => {
            toast.dismiss(t.id);
            performDelete(id); // tách riêng
          }} className="px-2 py-1 bg-red-500 text-white rounded">Yes</button>
          <button onClick={() => toast.dismiss(t.id)} className="px-2 py-1 bg-gray-300 rounded">No</button>
        </div>
      </span>
    ));
  };

  const performDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/admin/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets((prev) => prev.filter((pet) => pet.id !== id));
      toast.success("Pet deleted successfully.");
    } catch (err) {
      console.error("Error deleting pet:", err);
      toast.error("Failed to delete pet.");
    }
  };


  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (search.length > 100) {
      toast.error("Search keyword too long");
    }
  }, [search]);

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-8 text-gray-700">
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="text-customPurple hover:underline flex items-center gap-1"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold">Pet Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, breed, or type..."
            className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple text-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PetDonutChart data={pets} />
        <PetBarChart data={pets} />
      </div>

      {/* Add New Pet Button */}
      <div className="flex items-center">
        <Link
          to="/admin/pets/create"
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add New Pet
        </Link>
      </div>

      {/* Table */}
      <div ref={tableRef} className="bg-white shadow rounded-2xl overflow-hidden overflow-x-auto">
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
                <td colSpan="7" className="text-center py-4">
                  <Loader className="animate-spin inline-block w-6 h-6 text-gray-400" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">No pets found.</td>
              </tr>
            ) : (
              currentItems.map((pet) => (
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
                        onClick={() => confirmDelete(pet.id)}
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
      {!loading && filtered.length > 0 && (
        <p className="text-sm text-gray-500 text-center mt-4">
          Showing {startIdx + 1}–{Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length} pets
        </p>
      )}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-xl border text-sm transition shadow-sm ${currentPage === page
                ? "bg-customPurple text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
