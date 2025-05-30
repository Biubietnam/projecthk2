// FeedbackManagement.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useModal } from '../../../Appwrapper';
import FeedbackDetailForm from "./FeedbackDetailForm";
import FeedbackReplyForm from "./FeedbackReplyForm";
import dayjs from 'dayjs';
import { Eye, MessageCircle, Trash2, LayoutDashboard } from 'lucide-react';
import ReactApexChart from "react-apexcharts";
import toast, { Toaster } from "react-hot-toast";

function FeedbackAreaChart({ data }) {
  const grouped = data.reduce((acc, item) => {
    const date = dayjs(item.created_at).format("YYYY-MM-DD");
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
    colors: ['#5B21B6']
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">Feedback Over Time</h2>
      <ReactApexChart options={options} series={[{ name: 'Feedbacks', data: seriesData }]} type="area" height={240} />
    </div>
  );
}

function FeedbackDonutChart({ data }) {
  const replied = data.filter(fb => fb.reply).length;
  const pending = data.length - replied;
  const total = data.length;
  const series = [replied, pending];
  const options = {
    chart: { type: 'donut' },
    labels: ['Replied', 'Pending'],
    colors: ['#10B981', '#F59E0B'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
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
      <h2 className="text-lg text-gray-700 mb-4">Reply Status</h2>
      <ReactApexChart key={data.length} options={options} series={series} type="donut" height={240} />
    </div>
  );
}

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { openModal } = useModal();
  const tableRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get("http://localhost:8000/api/admin/feedbacks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(data);
    } catch (err) {
      toast.error("Failed to fetch feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <span>
        Are you sure?
        <button onClick={async () => {
          toast.dismiss(t.id);
          try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://localhost:8000/api/admin/feedbacks/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(prev => prev.filter(fb => fb.id !== id));
            toast.success("Deleted successfully");
          } catch {
            toast.error("Failed to delete feedback.");
          }
        }} className="ml-2 font-semibold text-red-500">Yes</button>
      </span>
    ), { duration: 6000 });
  };

  const showDetail = fb => openModal({ title: 'Feedback Details', body: <FeedbackDetailForm feedback={fb} /> });
  const showReply = fb => openModal({ title: 'Reply Feedback', body: <FeedbackReplyForm feedback={fb} onSuccess={fetchFeedbacks} /> });

  useEffect(() => { fetchFeedbacks(); }, []);
  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [currentPage]);

  const filtered = feedbacks.filter(fb =>
    fb.name.toLowerCase().includes(search.toLowerCase()) ||
    fb.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => Math.abs(p - currentPage) <= 2);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-8 text-gray-700">
      <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: "#f9f9f9", color: "#333", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", fontSize: "14px", fontWeight: "500" }, iconTheme: { primary: "#10b981", secondary: "#ECFDF5" } }} />

      <div className="flex items-center justify-between">
        <Link to="/admin/dashboard" className="text-customPurple hover:underline flex items-center gap-1">
          <LayoutDashboard className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-semibold">Feedback Management</h1>
        <input type="text" placeholder="Search by name or email..." className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple text-sm w-64" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackAreaChart data={feedbacks} />
        <FeedbackDonutChart data={feedbacks} />
      </div>

      <div ref={tableRef} className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-400">Loading...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-400">No feedbacks found.</td></tr>
            ) : (
              currentItems.map(fb => (
                <tr key={fb.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{fb.name}</td>
                  <td className="px-6 py-4">{fb.email}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button onClick={() => showDetail(fb)} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {fb.reply ? (
                      <button disabled className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg cursor-not-allowed">
                        <MessageCircle className="w-4 h-4" /> Replied
                      </button>
                    ) : (
                      <button onClick={() => showReply(fb)} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                        <MessageCircle className="w-4 h-4" /> Reply
                      </button>
                    )}
                    <button onClick={() => handleDelete(fb.id)} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
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
          Showing {startIdx + 1}–{Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length} feedbacks
        </p>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50" disabled={currentPage === 1}>Prev</button>
          {visiblePages.map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded-xl border text-sm transition shadow-sm ${currentPage === page ? "bg-customPurple text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50" disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
}
