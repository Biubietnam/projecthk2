import React, { useState, useMemo } from "react";

const SlotSelector = ({ allSlots, bookedSlots, formData, setFormData }) => {
  // Divide slots into pages, 4 slots per page
  const slotsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(allSlots.length / slotsPerPage);

  // Paginate slots using useMemo for performance
  const paginatedSlots = useMemo(() => {
    const start = currentPage * slotsPerPage;
    return allSlots.slice(start, start + slotsPerPage);
  }, [allSlots, currentPage]);

  // Get today's date and current time
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();

  /**
   * Check if the given time slot is in the past
   * Only applies if the selected date is today
   */
  const isPastSlot = (slot) => {
    if (formData.date !== today) return false;
    const [hour, minute] = slot.split(":").map(Number);
    const slotTime = new Date();
    slotTime.setHours(hour, minute, 0, 0);
    return slotTime < now;
  };

  // Navigation handlers for paging
  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="w-full">
      <label className="block mb-2 font-medium">Time Slot</label>
      <div className="flex items-center gap-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ←
        </button>

        {/* Time Slot Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {paginatedSlots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isPast = isPastSlot(slot);
            const isDisabled = isBooked || isPast;
            const isSelected = formData.time_slot === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={isDisabled}
                onClick={() =>
                  !isDisabled && setFormData({ ...formData, time_slot: slot })
                }
                className={`w-full py-2 px-3 rounded-md border text-sm font-medium transition-all
                  ${
                    isDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                      : isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-blue-100 text-gray-700 border-gray-300"
                  }`}
              >
                {slot} {isBooked ? "(Booked)" : isPast ? "(Past)" : ""}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default SlotSelector;
