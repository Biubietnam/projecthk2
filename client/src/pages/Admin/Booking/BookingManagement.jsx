import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking) => {
    setEditing(booking.id);
    setForm({ ...booking });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/bookings/${id}`, form);
      await fetchBookings();
      setEditing(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure to cancel this booking?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/bookings/${id}`);
      await fetchBookings();
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 w-full px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center text-[#6D7AB5] mb-8">
        Booking Management
      </h1>
      <div className="mb-2">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center rounded text-sm text-customPurple hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
        <table className="min-w-[1000px] w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Pet</th>
              <th className="p-4">Service</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time Slot</th>
              <th className="p-4">Status</th>
              <th className="p-4">Notes</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4">{booking.id}</td>
                  <td className="p-4">
                    {booking.user?.name || booking.user_id}
                  </td>
                  <td className="p-4">{booking.pet?.name || booking.pet_id}</td>
                  <td className="p-4">{booking.service?.service_name}</td>
                  <td className="p-4">
                    {editing === booking.id ? (
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="input-style"
                      />
                    ) : (
                      booking.date
                    )}
                  </td>
                  <td className="p-4">
                    {editing === booking.id ? (
                      <input
                        type="time"
                        name="time_slot"
                        value={form.time_slot}
                        onChange={handleChange}
                        className="input-style"
                      />
                    ) : (
                      booking.time_slot
                    )}
                  </td>
                  <td className="p-4">
                    {editing === booking.id ? (
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="input-style"
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                          booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "Confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 max-w-sm whitespace-pre-wrap">
                    {editing === booking.id ? (
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        className="input-style"
                      />
                    ) : (
                      booking.notes
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editing === booking.id ? (
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          onClick={() => handleSave(booking.id)}
                          className="btn-save"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="btn-cancel"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="btn-edit"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn-delete"
                        >
                          🗑️ Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
<style>
  {`
  .input-style {
    @apply border border-gray-300 rounded px-3 py-1 w-full text-sm;
  }
  .btn-edit {
    @apply bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow;
  }
  .btn-delete {
    @apply bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm shadow;
  }
  .btn-save {
    @apply bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm shadow;
  }
  .btn-cancel {
    @apply bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm shadow;
  }
`}
</style>;
