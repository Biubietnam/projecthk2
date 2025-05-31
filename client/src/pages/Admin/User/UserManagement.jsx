import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import toast, { Toaster } from "react-hot-toast";
import { LayoutDashboard } from "lucide-react";

function UserGrowthChart({ data }) {
  const grouped = data.reduce((acc, user) => {
    const date = new Date(user.created_at).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();
  const seriesData = sortedDates.map(date => ({ x: date, y: grouped[date] }));

  const options = {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] }
    },
    dataLabels: { enabled: false },
    xaxis: { type: 'category', labels: { rotate: -45 } },
    yaxis: { labels: { formatter: val => Math.floor(val) } },
    tooltip: { x: { format: 'yyyy-MM-dd' }, theme: 'light' },
    colors: ['#3B82F6']
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">User Growth Over Time</h2>
      <ReactApexChart options={options} series={[{ name: 'New Users', data: seriesData }]} type="area" height={240} />
    </div>
  );
}

function UserRoleDonutChart({ data }) {
  const grouped = data.reduce((acc, user) => {
    const role = user.role?.name || "unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const series = Object.values(grouped);
  const total = series.reduce((a, b) => a + b, 0);

  const options = {
    chart: { type: 'donut' },
    labels,
    colors: ['#F59E0B', '#10B981', '#6366F1', '#EF4444', '#8B5CF6', '#6B7280'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (value, { w }) => {
          const t = w?.globals?.seriesTotals?.reduce((a, b) => a + b, 0) || total;
          const pct = ((value / t) * 100).toFixed(1);
          return `${value} users (${pct}%)`;
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: { show: true, label: "Total", formatter: () => total }
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">User Roles</h2>
      <ReactApexChart key={data.length} options={options} series={series} type="donut" height={240} />
    </div>
  );
}

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
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

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
      <div className="flex justify-between items-center">
        <Link
          to="/admin/dashboard"
          className="text-customPurple hover:underline flex items-center gap-1"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart data={users} />
        <UserRoleDonutChart data={users} />
      </div>

      {/* Một button nằm bên trái */}
      <div className="flex justify-end mb-4">
        <Link to="/admin/users/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Add New User
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50">
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
                  <td className="p-4">
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
