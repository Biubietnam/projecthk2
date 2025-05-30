import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SlotSelector from "./SlotSelector";
import SuccessPopup from "./SuccessPopUp";

const BookingModal = ({ onClose }) => {
  const [allSlots, setAllSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    service_id: "",
    time_slot: "",
    notes: "",
  });

  const userData = JSON.parse(localStorage.getItem("user_info") || "null");
  const petData = JSON.parse(localStorage.getItem("selectedPet") || "null");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "service_id" || name === "date" ? { time_slot: "" } : {}),
    }));
  }, []);

  useEffect(() => {
    if (!formData.service_id || !formData.date) {
      setAllSlots([]);
      setBookedSlots([]);
      setFormData((prev) => ({ ...prev, time_slot: "" }));
      return;
    }

    let isMounted = true;
    setLoadingSlots(true);
    axios
      .get("https://thoriumstudio.xyz/api/booked-time-slots", {
        params: {
          service_id: formData.service_id,
          date: formData.date,
        },
      })
      .then((res) => {
        if (isMounted) {
          setAllSlots(res.data.all_slots || []);
          setBookedSlots(res.data.booked_slots || []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAllSlots([]);
          setBookedSlots([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [formData.service_id, formData.date]);

  const validateForm = () => {
    if (!userData) {
      setErrorMsg("You need to log in to book an appointment.");
      return false;
    }
    if (!petData) {
      setErrorMsg("Please select a pet.");
      return false;
    }
    if (!formData.service_id) {
      setErrorMsg("Please select a service.");
      return false;
    }
    if (!formData.date) {
      setErrorMsg("Please select a date.");
      return false;
    }
    if (!formData.time_slot) {
      setErrorMsg("Please select a time slot.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    const payload = {
      user_id: userData.id,
      pet_id: petData.id,
      service_id: Number(formData.service_id),
      date: formData.date,
      time_slot: formData.time_slot,
      notes: formData.notes || "",
    };

    try {
      await axios.post("https://thoriumstudio.xyz/api/bookings", payload);
      setShowSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Booking failed. Please try again.";
      alert(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto p-6 animate-fadeIn scale-95">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl text-center font-semibold mb-4 text-[#374151]">
          Book Appointment
        </h2>

        {errorMsg && (
          <p className="text-center text-red-500 font-medium mb-4">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {petData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReadOnlyInput label="Name" value={petData.name} />
              <ReadOnlyInput label="Species" value={petData.species} />
              <ReadOnlyInput label="Breed" value={petData.breed} />
              <ReadOnlyInput label="Age" value={petData.age} />
              <ReadOnlyInput label="Gender" value={petData.gender} />
              <ReadOnlyInput label="Weight (kg)" value={petData.weight_kg} />
            </div>
          )}

          <SelectInput
            label="Service"
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            options={[
              { value: "", label: "-- Select service --" },
              { value: 1, label: "Vet At Clinic" },
              { value: 2, label: "Basic Spa" },
              { value: 3, label: "Premium Spa" },
              { value: 4, label: "Ultra Spa" },
            ]}
          />

          <div>
            <label className="text-sm font-medium block mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {loadingSlots ? (
            <div className="text-center py-4">
              <div className="h-6 w-6 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm mt-2 text-gray-500">
                Loading time slots...
              </div>
            </div>
          ) : (
            <SlotSelector
              allSlots={allSlots}
              bookedSlots={bookedSlots}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          <div>
            <label className="text-sm font-medium block mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 resize-none"
              placeholder="Additional notes..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Submitting..." : "Book Appointment"}
          </button>

          {showSuccess && (
            <SuccessPopup
              message="Thank you for booking! We will contact you soon."
              onClose={() => {
                setShowSuccess(false);
                onClose();
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

const ReadOnlyInput = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium block mb-1">{label}</label>
    <input
      type="text"
      value={value}
      readOnly
      className="w-full border rounded px-3 py-2 bg-gray-100"
    />
  </div>
);

const SelectInput = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium block mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border rounded px-3 py-2"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default BookingModal;
