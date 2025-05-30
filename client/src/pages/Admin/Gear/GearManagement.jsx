// GearManagement.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LayoutDashboard, Trash2, Pencil } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";

function GearDonutChart({ data }) {
    const grouped = data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {});

    const categories = Object.keys(grouped);
    const series = Object.values(grouped);
    const total = series.reduce((a, b) => a + b, 0);

    const options = {
        chart: { type: "donut" },
        labels: categories,
        colors: ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#A78BFA", "#3B82F6", "#F472B6", "#22D3EE"],
        legend: { position: "bottom" },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            y: {
                formatter: (value, { w }) => {
                    if (!w || !w.globals || !w.globals.seriesTotals) return value;
                    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${value} items (${percentage}%)`;
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
            <h2 className="text-lg text-gray-700 mb-4">Gears by Category</h2>
            <ReactApexChart key={data.length} options={options} series={series} type="donut" height={240} />
        </div>
    );
}

function GearAreaChart({ data }) {
    const grouped = data.reduce((acc, item) => {
        const date = dayjs(item.created_at).format("YYYY-MM-DD");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort();
    const seriesData = sortedDates.map(date => ({ x: date, y: grouped[date] }));

    const options = {
        chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: "smooth", width: 2 },
        fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] }
        },
        dataLabels: { enabled: false },
        xaxis: { type: "category", labels: { rotate: -45 } },
        yaxis: { labels: { formatter: val => Math.floor(val) } },
        tooltip: { x: { format: "yyyy-MM-dd" }, theme: "light" },
        colors: ["#6366F1"]
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg text-gray-700 mb-4">Gear Activity Over Time</h2>
            <ReactApexChart options={options} series={[{ name: "Gears", data: seriesData }]} type="area" height={240} />
        </div>
    );
}

export default function GearManagement() {
    const [gears, setGears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const filtered = gears.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentItems = filtered.slice(startIdx, startIdx + itemsPerPage);
    const tableRef = useRef();
    const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => Math.abs(p - currentPage) <= 2);


    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentPage]);

    const fetchGears = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get("http://localhost:8000/api/gears", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Fetched gears:", response.data);
            setGears(response.data);
        } catch (err) {
            toast.error("Failed to fetch gears. Please try again.");
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
            setGears(prev => prev.filter(g => g.id !== id));
        } catch (err) {
            console.error("Error deleting gear:", err);
            toast.error("Failed to delete gear. Please try again.");
        }
    };

    useEffect(() => { fetchGears(); }, []);

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
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GearAreaChart data={gears} />
                <GearDonutChart data={gears} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/admin/dashboard" className="text-customPurple hover:underline flex items-center gap-1">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </Link>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple text-sm w-64"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl">Gear Management</h1>
                <Link to="/admin/gears/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Add New Gear
                </Link>
            </div>

            {/* Table */}
            <div ref={tableRef} className="bg-white shadow rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-base">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Highlights</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-400 animate-pulse">
                                    <span className="inline-block w-6 h-6 border-4 border-customPurple border-t-transparent rounded-full animate-spin" />
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-400">No gears found.</td></tr>
                        ) : (
                            currentItems.map((gear) => (
                                <tr key={gear.id} className="hover:bg-gray-50 transition-colors text-sm">
                                    <td className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 max-w-xs break-words"
                                                title={gear.name}
                                            >
                                                {gear.name}
                                            </span>

                                            {gear.is_new === 1 && (
                                                <span className="text-[11px] font-medium tracking-wide bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    NEW
                                                </span>
                                            )}

                                            {gear.sale_percent > 0 && (
                                                <span className="text-[11px] font-medium tracking-wide bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                                    -{gear.sale_percent}%
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded whitespace-nowrap ${gear.petType === 'Dogs' ? 'bg-yellow-100 text-yellow-800' :
                                            gear.petType === 'Cats' ? 'bg-purple-100 text-purple-800' :
                                                gear.petType === 'Rodents' ? 'bg-green-100 text-green-800' :
                                                    gear.petType === 'Reptiles' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {gear.petType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">${gear.price}</td>
                                    <td className="px-6 py-4">
                                        {Array.isArray(gear.highlights) && gear.highlights.slice(0, 2).map((h, i) => (
                                            <span
                                                key={i}
                                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 whitespace-nowrap"
                                            >
                                                {h}
                                            </span>
                                        ))}
                                        {gear.highlights?.length > 2 && (
                                            <span className=" text-gray-500 ml-1">+{gear.highlights.length - 2} more</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                                        <Link
                                            to={`/admin/gears/edit/${gear.id}`}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                                        >
                                            <Pencil className="w-4 h-4" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(gear.id)}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {!loading && filtered.length > 0 && (
                <p className="text-sm text-gray-500 text-center mt-4">
                    Showing {startIdx + 1}–{Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length} gears
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
