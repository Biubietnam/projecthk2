import React, { useState } from "react";
import axios from "axios";

export default function AdoptionResponseForm({ request }) {
    const [approveNote, setApproveNote] = useState("");
    const [approveDateTime, setApproveDateTime] = useState("");
    const [rejectNote, setRejectNote] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (action, data) => {
        const token = localStorage.getItem("access_token");
        try {
            await axios.patch(`http://localhost:8000/api/adoption-requests/${request.id}/${action}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(`Adoption request ${action}d successfully!`);
        }
        catch (err) {
            console.error(`Error ${action}ing adoption request:`, err);
            alert(`Failed to ${action} request: ${err.response?.data?.message || "Unknown error"}`);
        }
        finally {
            window.location.href = "/admin/adoptionmanagement";
        }
    };

    const handleApprove = async () => {
        setLoading(true);
        try {
            if (!approveDateTime) {
                alert("Please select an approval date and time.");
                setLoading(false);
                return;
            }
            if (!approveNote) {
                alert("Please provide an optional note for approval.");
                setLoading(false);
                return;
            }
            await onSubmit("approve", {
                note: approveNote,
                scheduled_at: approveDateTime,
            });
        } catch (err) {
            console.error("Error approving adoption request:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            if (!rejectNote) {
                alert("Please provide a reason for rejection.");
                setLoading(false);
                return;
            }
            await onSubmit("reject", { note: rejectNote });
        } catch (err) {
            console.error("Error rejecting adoption request:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 font-sans">
            {/* Approve Side */}
            <div className="border rounded-xl p-5 shadow-sm bg-white">
                <h2 className="text-lg font-semibold mb-4">Approve Request</h2>

                <label className="block text-sm font-medium mb-1">Approval Date & Time</label>
                <input
                    type="datetime-local"
                    value={approveDateTime}
                    onChange={(e) => setApproveDateTime(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea
                    value={approveNote}
                    onChange={(e) => setApproveNote(e.target.value)}
                    rows={4}
                    className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add an optional note for approval..."
                />

                <button
                    onClick={handleApprove}
                    disabled={loading || !approveDateTime}
                    className={`mt-4 w-full py-2 rounded-md text-sm font-medium text-white transition ${loading || !approveDateTime
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Processing..." : "Approve Request"}
                </button>
            </div>

            {/* Reject Side */}
            <div className="border rounded-xl p-5 shadow-sm bg-white">
                <h2 className="text-lg font-semibold mb-4">Reject Request</h2>

                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    rows={6}
                    className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Reason for rejection (optional)..."
                />

                <button
                    onClick={handleReject}
                    disabled={loading}
                    className={`mt-4 w-full py-2 rounded-md text-sm font-medium text-white transition ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                        }`}
                >
                    {loading ? "Processing..." : "Reject Request"}
                </button>
            </div>
        </div>
    );
}
