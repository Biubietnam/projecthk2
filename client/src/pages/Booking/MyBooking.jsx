import React, { useEffect, useState } from "react";
import axios from "axios";
import CancelConfirm from "./CancelConfirm";
import { FaCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user_info") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData?.id) return;

    axios
      .get(`http://localhost:8000/api/user/${userData.id}/bookings`)
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  }, [userData]);

  const handleCancel = (id) => {
    setConfirmId(id);
  };

  const confirmCancel = () => {
    setIsCancelling(true);
    axios
      .delete(`http://localhost:8000/api/bookings/${confirmId}`)
      .then(() => {
        setBookings((prev) => prev.filter((b) => b.id !== confirmId));
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

  return (
    <div className="min-h-screen w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-20 mx-auto font-sans">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4F5BA6] flex items-center justify-center gap-4 mb-6 tracking-wide">
          <FaCalendarCheck className="text-5xl sm:text-6xl" />
          My Bookings
        </h1>

        <button
          onClick={() => {
            navigate("/petlist");
            window.location.reload();
          }}
          className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-500 text-white px-8 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
        >
          Booking New Service
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 text-center">
          <span className="inline-block px-6 py-3 bg-green-100 text-green-800 text-lg rounded-lg font-semibold shadow-sm">
            {successMessage}
          </span>
        </div>
      )}

      {loading ? (
        <p className="text-lg sm:text-xl text-gray-600 text-center font-medium">
          Loading bookings...
        </p>
      ) : bookings.length === 0 ? (
        <p className="text-lg sm:text-xl text-gray-500 text-center font-medium">
          No bookings found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
          <table className="min-w-full text-base sm:text-lg text-left text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800 uppercase text-sm sm:text-base font-semibold tracking-wide">
              <tr>
                <th className="px-6 py-4">Pet</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-indigo-50 transition duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    {booking.pet?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4">{booking.service_name || "N/A"}</td>
                  <td className="px-6 py-4">{booking.date}</td>
                  <td className="px-6 py-4">{booking.time_slot}</td>
                  <td className="px-6 py-4">{booking.notes || "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-base sm:text-lg font-semibold transition shadow-md"
                    >
                      Cancel
                    </button>
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
