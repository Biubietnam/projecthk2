import React, { useState, useEffect } from "react";
import axios from "axios";
import SlotSelector from "./SlotSelector";

const BookingModal = ({ onClose }) => {
  const [allSlots, setAllSlots] = useState([]); // Tất cả khung giờ theo dịch vụ
  const [bookedSlots, setBookedSlots] = useState([]); // Giờ đã bị đặt không thể chọn
  const [loadingSlots, setLoadingSlots] = useState(false); // Loading khi lấy giờ

  // State to manage form data
  const [formData, setFormData] = useState({
    pet_id: "",
    service_id: "",
    date: "",
    time_slot: "",
    notes: "",
  });

  const userData = JSON.parse(localStorage.getItem("user_info") || "null");
  const petData = JSON.parse(localStorage.getItem("selectedPet") || "null");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // Nếu thay đổi service_id hoặc date, reset time_slot
      if (name === "service_id" || name === "date") {
        return { ...prev, [name]: value, time_slot: "" };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  useEffect(() => {
    if (formData.service_id && formData.date) {
      setLoadingSlots(true);
      axios
        .get("https://thoriumstudio.xyz/api/booked-time-slots", {
          params: {
            service_id: formData.service_id,
            date: formData.date,
          },
        })
        .then((response) => {
          setAllSlots(response.data.all_slots);
          setBookedSlots(response.data.booked_slots);
          setLoadingSlots(false);
        })
        .catch((error) => {
          console.error("Lỗi lấy giờ đã đặt:", error);
          setAllSlots([]);
          setBookedSlots([]);
          setLoadingSlots(false);
        });
    } else {
      setAllSlots([]);
      setBookedSlots([]);
      setFormData((prev) => ({ ...prev, time_slot: "" }));
    }
  }, [formData.service_id, formData.date]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userData) {
      alert("Bạn cần đăng nhập để đặt lịch.");
      return;
    }

    if (!formData.service_id) {
      alert("Vui lòng chọn dịch vụ.");
      return;
    }
    if (!formData.date) {
      alert("Vui lòng chọn ngày.");
      return;
    }
    if (!formData.time_slot) {
      alert("Vui lòng chọn khung giờ.");
      return;
    }

    const payload = {
      ...formData,
      user_id: userData.id,
      pet_id: petData ? petData.id : null,
    };

    axios
      .post("https://thoriumstudio.xyz/api/bookings", payload)
      .then(() => {
        alert("Đặt lịch thành công!");
        onClose();
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          // Lỗi xung đột - thời gian đã bị đặt
          alert(err.response.data.error); // Sẽ hiện: "Thời gian này đã được đặt trước"
        } else if (err.response?.data?.error) {
          // Các lỗi có trả message từ server
          alert("Lỗi: " + err.response.data.error);
        } else {
          alert("Lỗi đặt lịch. Vui lòng thử lại.");
        }
        console.error(err);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg z-50 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl  text-center mb-4">BOOKING FORM</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pet Info */}
          {petData && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={petData.name}
                    readOnly
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Species</label>
                  <input
                    type="text"
                    value={petData.species}
                    readOnly
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Breed</label>
                  <input
                    type="text"
                    value={petData.breed}
                    readOnly
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Age</label>
                  <input
                    type="text"
                    value={petData.age}
                    readOnly
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <input
                    type="text"
                    value={petData.gender}
                    readOnly
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <input
                    type="text"
                    value={petData.weight_kg}
                    readOnly
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* Select dịch vụ */}
          <div>
            <label>Dịch vụ</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Chọn dịch vụ --</option>
              <option value="1">Basic Spa</option>
              <option value="2">Premium Spa</option>
              <option value="3">Ultra Spa</option>
              <option value="4">Vet At Clinic</option>
            </select>
          </div>

          {/* Chọn ngày */}
          <div>
            <label>Ngày</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Chọn giờ */}
          <SlotSelector
            allSlots={allSlots}
            bookedSlots={bookedSlots}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Notes */}
          <div>
            <label className="text-sm font-medium">Ghi chú</label>
            <textarea
              name="notes"
              placeholder="Ghi chú (nếu có)"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Xác nhận đặt lịch
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
