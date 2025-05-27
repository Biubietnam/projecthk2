import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SlotSelector from "./SlotSelector";
import SuccessPopup from "./SuccessPopUp";

const BookingModal = ({ onClose }) => {
  // State to hold all time slots for the selected service
  const [allSlots, setAllSlots] = useState([]);
  // State to hold already booked slots (disabled)
  const [bookedSlots, setBookedSlots] = useState([]);
  // Loading indicator for time slot fetching
  const [loadingSlots, setLoadingSlots] = useState(false);
  // Submitting indicator for the booking form
  const [submitting, setSubmitting] = useState(false);
  // State for form validation error messages
  const [errorMsg, setErrorMsg] = useState("");

  // Booking form state: date, service, time slot, and notes
  const [formData, setFormData] = useState({
    date: "",
    service_id: "",
    time_slot: "",
    notes: "",
  });

  // Get user info from localStorage (parse once)
  const userData = React.useMemo(
    () => JSON.parse(localStorage.getItem("user_info") || "null"),
    []
  );
  // Get selected pet info from localStorage
  const petData = React.useMemo(
    () => JSON.parse(localStorage.getItem("selectedPet") || "null"),
    []
  );

  /**
   * Handle input changes in the form
   * Reset time_slot if service_id or date is changed
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "service_id" || name === "date" ? { time_slot: "" } : {}),
    }));
  }, []);

  // Success popup state
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * useEffect to fetch time slots whenever service_id or date changes
   */
  useEffect(() => {
    if (!formData.service_id || !formData.date) {
      // Reset if service or date not selected
      setAllSlots([]);
      setBookedSlots([]);
      setFormData((prev) => ({ ...prev, time_slot: "" }));
      return;
    }

    let isMounted = true;

    setLoadingSlots(true);
    axios
      .get("http://localhost:8000/api/booked-time-slots", {
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

  /**
   * Form validation before submission
   */
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

  /**
   * Submit form handler
   */
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
      await axios.post("http://localhost:8000/api/bookings", payload);
      setShowSuccess(true);
    } catch (err) {
      if (err.response?.status === 409) {
        alert(
          err.response.data.error || "This time slot has already been booked."
        );
      } else if (err.response?.data?.error) {
        alert("Error: " + err.response.data.error);
      } else {
        alert("Booking failed. Please try again.");
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>

      {/* Modal content */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg z-50 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-2xl text-center mb-4 font-semibold">
          Book Appointment
        </h2>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-3 text-red-600 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Booking form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pet info */}
          {petData && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ReadOnlyInput label="Name" value={petData.name} />
                <ReadOnlyInput label="Species" value={petData.species} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ReadOnlyInput label="Breed" value={petData.breed} />
                <ReadOnlyInput label="Age" value={petData.age} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ReadOnlyInput label="Gender" value={petData.gender} />
                <ReadOnlyInput label="Weight (kg)" value={petData.weight_kg} />
              </div>
            </>
          )}

          {/* Service selector */}
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

          {/* Date picker */}
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

          {/* Time slot selector */}
          {loadingSlots ? (
            <div className="text-center py-2 text-gray-500">
              Loading time slots... 🕒
            </div>
          ) : (
            <SlotSelector
              allSlots={allSlots}
              bookedSlots={bookedSlots}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium block mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Enter notes (if any)..."
              className="w-full border rounded px-3 py-2 resize-none"
            ></textarea>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Submitting..." : "Book Appointment"}
          </button>

          {/* Success popup */}
          {showSuccess && (
            <SuccessPopup
              message="Thank you for booking! We will contact you soon."
              onClose={() => {
                onClose();
                setShowSuccess(false);
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

// Read-only input field with label
const ReadOnlyInput = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium block mb-1">{label}</label>
    <input
      type="text"
      value={value}
      readOnly
      className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
    />
  </div>
);

// Select input with label
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
