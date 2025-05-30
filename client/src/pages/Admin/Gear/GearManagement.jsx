// GearManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LayoutDashboard, Trash2, Pencil } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";

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

    const fetchGears = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get("https://thoriumstudio.xyz/api/gears", {
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
            await axios.delete(`https://thoriumstudio.xyz/api/admin/gears/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGears(prev => prev.filter(g => g.id !== id));
        } catch (err) {
            console.error("Error deleting gear:", err);
            alert("Failed to delete gear.");
        }
    };

    useEffect(() => { fetchGears(); }, []);

    const filtered = gears.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-8 text-gray-700">
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
            <div className="bg-white shadow rounded-2xl overflow-hidden">
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
                            <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-400">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-400">No gears found.</td></tr>
                        ) : (
                            filtered.map((gear) => (
                                <tr key={gear.id} className="hover:bg-gray-50 transition-colors text-sm">
                                    <td className="px-6 py-4 font-medium">{gear.name}</td>
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
        </div>
    );
}
