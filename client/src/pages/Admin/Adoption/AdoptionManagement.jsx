// Thuc - Adoption Management
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useModal } from '../../../Appwrapper';
import AdoptionResponseForm from "./AdoptionResponseForm";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { LayoutDashboard } from 'lucide-react';
import AdoptionDetailForm from "./AdoptionDetailForm";

function AdoptionAreaChart({ data }) {
  const grouped = data.reduce((acc, item) => {
    const date = dayjs(item.requested_at).format("YYYY-MM-DD");
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
    colors: ['#10B981']
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">Adoption Requests Over Time</h2>
      <ReactApexChart options={options} series={[{ name: 'Adoptions', data: seriesData }]} type="area" height={240} />
    </div>
  );
}

function AdoptionDonutChart({ data }) {
  const pending = data.filter(r => r.status === 'pending').length;
  const approved = data.filter(r => r.status === 'approved').length;
  const rejected = data.filter(r => r.status === 'rejected').length;
  const total = pending + approved + rejected;

  const series = [approved, rejected, pending];
  const options = {
    chart: { type: 'donut' },
    labels: ['Approved', 'Rejected', 'Pending'],
    colors: ['#10B981', '#EF4444', '#F59E0B'],
    legend: { position: 'bottom' },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false }
    },
    tooltip: {
      y: {
        formatter: (val, { w }) => {
          const t = w?.globals?.seriesTotals?.reduce((a, b) => a + b, 0) || total;
          const pct = ((val / t) * 100).toFixed(1);
          return `${val} requests (${pct}%)`;
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: { show: true, label: 'Total', formatter: () => total }
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">Request Status</h2>
      <ReactApexChart options={options} series={series} type="donut" height={240} />
    </div>
  );
}

export default function AdoptionManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filtered = requests.filter(req =>
    (req.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(req.pet_id).includes(search)
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/adoption-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      toast.error("Failed to fetch adoption requests");
      console.error("Error fetching adoption requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const showAdoptionResponseForm = (adoptID) => {
    const request = requests.find(r => r.id === adoptID);
    if (!request) return;
    const userName = request.user?.name || "Unknown User";
    openModal({
      title: `Respond to: ${userName}`,
      body: <AdoptionResponseForm request={request} />,
    });
  };

  const showDetailModal = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    openModal({
      title: `Adoption Request #${request.id}`,
      body: <AdoptionDetailForm request={request} />,
    });
  };

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4.93 4.93a10 10 0 0 1 14.14 14.14A10 10 0 0 1 4.93 4.93z"></path>
        </svg>
      </div>
    </div>
  ) : (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10">
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

      <div className="mb-2">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center rounded text-customPurple hover:underline"
        >
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Back to Admin Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <AdoptionAreaChart data={requests} />
        <AdoptionDonutChart data={requests} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Adoption Management</h1>
        <input
          type="text"
          placeholder="Search by user or pet ID..."
          className="px-3 py-2 border rounded-lg text-sm focus:ring-customPurple focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="p-4">User ID</th>
              <th className="p-4">Pet ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Note</th>
              <th className="p-4">Requested At</th>
              <th className="p-4">Approved At</th>
              <th className="p-4">Rejected At</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">Loading...</td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No adoption requests found.</td>
              </tr>
            ) : (
              currentItems.map((request) => (
                <tr key={request.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{request.user_id}</td>
                  <td className="p-4">{request.pet_id}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs inline-block ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-4 max-w-[100px] text-xs text-gray-600">
                    <div className="truncate">{request.note || "—"}</div>
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {request.requested_at || "—"}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {request.approved_at || "—"}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {request.rejected_at || "—"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => showDetailModal(request.id)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                      >
                        View
                      </button>
                      {request.status === 'pending' && (
                        <button
                          onClick={() => showAdoptionResponseForm(request.id)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        >
                          Respond
                        </button>
                      )}
                      {(request.status === 'approved' || request.status === 'rejected') && (
                        <span
                          className={`px-2 py-1 text-xs rounded capitalize ${request.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                        >
                          {request.status}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 0 && (
        <p className="text-sm text-gray-500 text-center mt-4">
          Showing {startIdx + 1}–{Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length} adoption requests
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">Prev</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => Math.abs(p - currentPage) <= 2)
            .map(page => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-xl border text-sm transition shadow-sm ${currentPage === page ? "bg-customPurple text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                {page}
              </button>
            ))}

          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
