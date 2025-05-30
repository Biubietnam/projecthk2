import React, { useEffect, useState } from "react";
import axios from "axios";
import { useModal } from "../../../Appwrapper";
import ContactDetailForm from "./ContactDetailForm";
import ContactReplyForm from "./ContactReplyForm";
import { Link } from "react-router-dom";
import { Eye, MessageCircle, Trash2, LayoutDashboard } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";

// ==== Area Chart: Contact over time ====
function ContactAreaChart({ data }) {
  const grouped = data.reduce((acc, item) => {
    const date = dayjs(item.created_at).format("YYYY-MM-DD");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();
  const seriesData = sortedDates.map((date) => ({ x: date, y: grouped[date] }));

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
      <h2 className="text-lg text-gray-700 mb-4">Contact Over Time</h2>
      <ReactApexChart options={options} series={[{ name: "Contacts", data: seriesData }]} type="area" height={240} />
    </div>
  );
}

// ==== Donut Chart: Contact reply status ====
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
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: { show: true, label: "Total", formatter: () => total },
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

// ==== MAIN PAGE ====
export default function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { openModal } = useModal();

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get("https://thoriumstudio.xyz/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`https://thoriumstudio.xyz/api/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prev) => prev.filter((ct) => ct.id !== id));
    } catch (err) {
      alert("Failed to delete contact.");
      console.error(err);
    }
  };

  const showDetail = (ct) =>
    openModal({ title: "Contact Details", body: <ContactDetailForm contact={ct} /> });

  const showReply = (ct) =>
    openModal({
      title: "Reply to Contact",
      body: <ContactReplyForm contact={ct} onSuccess={fetchContacts} />,
    });

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = contacts.filter(
    (ct) =>
      ct.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      ct.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-8 text-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin/dashboard" className="text-customPurple hover:underline flex items-center gap-1">
          <LayoutDashboard className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
        <div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple text-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContactAreaChart data={contacts} />
        <ContactDonutChart data={contacts} />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  No contacts found.
                </td>
              </tr>
            ) : (
              filtered.map((ct) => (
                <tr key={ct.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{ct.full_name}</td>
                  <td className="px-6 py-4">{ct.email}</td>
                  <td className="px-6 py-4">{ct.subject}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => showDetail(ct)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {ct.reply ? (
                      <button disabled className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg cursor-not-allowed">
                        <MessageCircle className="w-4 h-4" /> Replied
                      </button>
                    ) : (
                      <button onClick={() => showReply(ct)} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                        <MessageCircle className="w-4 h-4" /> Reply
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(ct.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
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
