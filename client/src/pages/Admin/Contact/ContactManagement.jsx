import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LayoutDashboard, Trash2, Eye, MessageCircle } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { useModal } from "../../../Appwrapper";
import ContactDetailForm from "./ContactDetailForm";
import ContactReplyForm from "./ContactReplyForm";

// Donut Chart
function ContactDonutChart({ data }) {
  const replied = data.filter((ct) => ct.reply).length;
  const pending = data.length - replied;
  const total = data.length;
  const series = [replied, pending];

  const options = {
    chart: { type: "donut" },
    labels: ["Replied", "Pending"],
    colors: ["#10B981", "#F59E0B"],
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (value, { w }) => {
          const totals = w?.globals?.seriesTotals;
          if (!totals) return `${value} contacts`;

          const total = totals.reduce((a, b) => a + b, 0);
          const percent = ((value / total) * 100).toFixed(1);
          return `${value} contacts (${percent}%)`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => (typeof total === 'number' ? total : 0),
            },
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">Reply Status</h2>
      <ReactApexChart key={data.length} options={options} series={series} type="donut" height={240} />
    </div>
  );
}

// Area Chart
function ContactAreaChart({ data }) {
  const grouped = data.reduce((acc, item) => {
    const date = dayjs(item.created_at).format("YYYY-MM-DD");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const sorted = Object.keys(grouped).sort();
  const seriesData = sorted.map((d) => ({ x: d, y: grouped[d] }));

  const options = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    dataLabels: { enabled: false },
    xaxis: { type: "category", labels: { rotate: -45 } },
    yaxis: { labels: { formatter: (val) => Math.floor(val) } },
    tooltip: { x: { format: "yyyy-MM-dd" }, theme: "light" },
    colors: ["#2563EB"],
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg text-gray-700 mb-4">Contact Volume Over Time</h2>
      <ReactApexChart key={seriesData.length} options={options} series={[{ name: "Contacts", data: seriesData }]} type="area" height={240} />
    </div>
  );
}

// Main Component
export default function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tableRef = useRef();
  const { openModal } = useModal();

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get("http://localhost:8000/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(data);
    } catch {
      toast.error("Failed to fetch contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);
  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const filtered = contacts.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const visible = filtered.slice(start, start + itemsPerPage);
  const pageList = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => Math.abs(p - currentPage) <= 2
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-8 text-gray-700">
      <Toaster position="bottom-right" toastOptions={{
        duration: 4000,
        style: {
          background: "#f9f9f9",
          color: "#333",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          fontSize: "14px",
          fontWeight: "500",
        },
        iconTheme: { primary: "#10b981", secondary: "#ECFDF5" },
      }} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContactAreaChart data={contacts} />
        <ContactDonutChart data={contacts} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin/dashboard" className="text-customPurple hover:underline flex items-center gap-1">
          <LayoutDashboard className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-sm w-full"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Table */}
      <div ref={tableRef} className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-center text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-8 text-center">
                  <span className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan="4" className="py-6 text-center text-gray-400">No contacts found.</td></tr>
            ) : (
              visible.map((ct) => (
                <tr key={ct.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{ct.full_name}</td>
                  <td className="px-6 py-4 text-blue-600">{ct.email}</td>
                  <td className="px-6 py-4">{ct.subject}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button onClick={() => openModal({ title: "Contact Details", body: <ContactDetailForm contact={ct} /> })}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {ct.reply ? (
                      <button disabled className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg opacity-60 cursor-not-allowed">
                        <MessageCircle className="w-4 h-4" /> Replied
                      </button>
                    ) : (
                      <button onClick={() => openModal({ title: "Reply", body: <ContactReplyForm contact={ct} onSuccess={fetchContacts} /> })}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                        <MessageCircle className="w-4 h-4" /> Reply
                      </button>
                    )}
                    <button onClick={() => handleDelete(ct.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
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
          Showing {start + 1}–{Math.min(start + itemsPerPage, filtered.length)} of {filtered.length} contacts
        </p>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50" disabled={currentPage === 1}>
            Prev
          </button>
          {pageList.map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-xl border text-sm transition shadow-sm ${currentPage === page
                ? "bg-customPurple text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"}`}>
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50" disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
