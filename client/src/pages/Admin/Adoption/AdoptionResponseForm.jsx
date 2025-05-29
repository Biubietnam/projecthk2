import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AdoptionResponseForm({ request }) {
    const [approveNote, setApproveNote] = useState("");
    const [approveDateTime, setApproveDateTime] = useState("");
    const [rejectNote, setRejectNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(null);

    const onSubmit = async (action, data) => {
        const token = localStorage.getItem("access_token");
        try {
            await axios.patch(
                `http://localhost:8000/api/adoption-requests/${request.id}/${action}`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success(`Request ${action}d successfully!`, {
                icon: "🎉",
            });
            setTimeout(() => {
                window.location.href = "/admin/adoptionmanagement";
            }, 2000);
        } catch (err) {
            console.error(`Error ${action}ing request:`, err);
            toast.error(
                `Failed to ${action}: ${err.response?.data?.message || "Unexpected error occurred."
                }`
            );
        }
    };

    const handleApprove = async () => {
        setLoading(true);
        if (!approveDateTime) {
            toast.error("Please select approval date & time.");
            setLoading(false);
            return;
        }
        if (!approveNote) {
            toast.error("Please provide a note for approval.");
            setLoading(false);
            return;
        }

        await onSubmit("approve", {
            note: approveNote,
            scheduled_at: approveDateTime,
        });
        setLoading(false);
    };

    const handleReject = async () => {
        setLoading(true);
        if (!rejectNote) {
            toast.error("Please provide a reason for rejection.");
            setLoading(false);
            return;
        }

        await onSubmit("reject", { note: rejectNote });
        setLoading(false);
    };

    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#f9f9f9",
                        color: "#333",
                        borderRadius: "12px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        fontSize: "14px",
                        fontWeight: "500",
                    },
                    iconTheme: {
                        primary: "#10b981",
                        secondary: "#ECFDF5",
                    },
                }}
            />
            {mode === null && (
                <div className="flex flex-col md:flex-row gap-4 text-center items-center justify-center p-6 bg-white rounded-xl shadow-sm max-w-xl mx-auto">
                    <button
                        onClick={() => setMode("approve")}
                        className="px-5 py-2 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                    >
                        Approve Request
                    </button>
                    <button
                        onClick={() => setMode("reject")}
                        className="px-5 py-2 w-full rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm"
                    >
                        Reject Request
                    </button>
                </div>
            )}

            {mode === "approve" && (
                <div className="border rounded-2xl p-6 shadow-sm bg-white mt-6 max-w-xl mx-auto w-full">
                    <h2 className="text-xl font-semibold mb-4">Approve Request</h2>

                    <label className="block text-sm font-medium mb-1">Approval Date & Time</label>
                    <input
                        type="datetime-local"
                        value={approveDateTime}
                        onChange={(e) => setApproveDateTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="block text-sm font-medium mb-1">Note</label>
                    <textarea
                        value={approveNote}
                        onChange={(e) => setApproveNote(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a note for approval..."
                    />

                    <div className="flex justify-between items-center gap-4 mt-4">
                        <button
                            onClick={() => setMode(null)}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={loading || !approveDateTime}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition ${loading || !approveDateTime
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Processing..." : "Approve"}
                        </button>
                    </div>
                </div>
            )}

            {mode === "reject" && (
                <div className="border rounded-2xl p-6 shadow-sm bg-white mt-6 max-w-xl mx-auto w-full">
                    <h2 className="text-xl font-semibold mb-4">Reject Request</h2>

                    <label className="block text-sm font-medium mb-1">Note</label>
                    <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Reason for rejection..."
                    />

                    <div className="flex justify-between items-center gap-4 mt-4">
                        <button
                            onClick={() => setMode(null)}
                            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={loading}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition ${loading
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {loading ? "Processing..." : "Reject"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
