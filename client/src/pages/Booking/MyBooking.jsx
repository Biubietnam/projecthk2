import React, { useEffect, useState } from "react";
import axios from "axios";
import CancelConfirm from "./CancelConfirm";
import { FaCalendarCheck, FaClock, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming"); // Default

  const userDataRaw = localStorage.getItem("user_info");
  const userId = userDataRaw ? JSON.parse(userDataRaw).id : null;

  const navigate = useNavigate();

  const fetchBookings = () => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/user/${userId}/bookings`, {
        params: { type: activeTab },
      })
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [userId, activeTab]);

  const handleCancel = (id) => {
    setConfirmId(id);
  };

  const confirmCancel = () => {
    setIsCancelling(true);
    axios
      .delete(`http://localhost:8000/api/bookings/${confirmId}`)
      .then(() => {
        // Cập nhật trạng thái Cancelled cho booking trong state
        setBookings((prev) =>
          prev.map((b) =>
            b.id === confirmId ? { ...b, status: "Cancelled" } : b
          )
        );
        setSuccessMessage("Booking cancelled successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setConfirmId(null);
        setIsCancelling(false);
      })
      .catch((err) => {
        alert("Failed to cancel booking.");
        console.error(err);
        setIsCancelling(false);
      });
  };

  // Backend đã trả data theo type, không cần filter ở frontend nữa
  const filteredBookings = bookings;

  return (
    <div className="min-h-screen w-full max-w-[1280px] px-4 py-20 mx-auto">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#4F5BA6] flex items-center justify-center gap-4 mb-6">
          <FaCalendarCheck className="text-4xl" />
          My Bookings
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm sm:text-base shadow ${
              activeTab === "upcoming"
                ? "bg-[#4F5BA6] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <FaClock />
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm sm:text-base shadow ${
              activeTab === "history"
                ? "bg-[#4F5BA6] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <FaHistory />
            History
          </button>
        </div>

        {/* Booking New */}
        <button
          onClick={() => {
            navigate("/petlist");
            window.location.reload();
          }}
          className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
        >
          Booking New Service
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 text-center">
          <span className="inline-block px-6 py-3 bg-green-100 text-green-800 text-base rounded-lg font-medium shadow-sm">
            {successMessage}
          </span>
        </div>
      )}

      {loading ? (
        <p className="text-lg text-gray-600 text-center font-medium">
          Loading bookings...
        </p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-lg text-gray-500 text-center font-medium">
          No bookings found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
          <table className="min-w-full text-sm sm:text-base text-left text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800 uppercase text-sm">
              <tr>
                <th className="px-6 py-4">Pet</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-indigo-50 transition duration-200"
                >
                  <td className="px-6 py-4">
                    {booking.pet?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4">{booking.service_name || "N/A"}</td>
                  <td className="px-6 py-4">{booking.date}</td>
                  <td className="px-6 py-4">{booking.time_slot}</td>
                  <td className="px-6 py-4">{booking.notes || "-"}</td>
                  <td className="px-6 py-4 capitalize font-medium">
                    {booking.status}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {booking.status === "Pending" ||
                    booking.status === "Confirmed" ? (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition shadow-md"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">No Action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmId && (
        <CancelConfirm
          message="Are you sure you want to cancel this booking?"
          onConfirm={confirmCancel}
          onCancel={() => {
            if (!isCancelling) setConfirmId(null);
          }}
          isLoading={isCancelling}
        />
      )}
    </div>
  );
};

export default MyBooking;
