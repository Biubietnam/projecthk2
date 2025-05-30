import React, { useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

export default function FeedbackReplyForm({ feedback, onSuccess }) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleReply = async () => {
        if (!message.trim()) {
            return alert("Reply message cannot be empty.");
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");

            await axios.post(`https://thoriumstudio.xyz/api/admin/feedbacks/${feedback.id}/replies`, {
                message,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("Reply sent successfully.");
            onSuccess?.();
        } catch (err) {
            console.error("Error sending reply:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return success ?
        <div className="text-green-600 text-sm font-medium">
            {success}
        </div>
        : error ?
        <div className="text-red-600 text-sm font-medium">
            {error}
        </div>
        : (
        <div className="text-[15px] text-gray-800 space-y-5 font-[system-ui] leading-relaxed">
            <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase tracking-widest">Recipient</label>
                <div className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    {feedback.email}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase tracking-widest">Message</label>
                <textarea
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl shadow-sm text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Type your reply here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>

            <div className="pt-1 text-right">
                <button
                    onClick={handleReply}
                    disabled={loading}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition ${loading
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {loading ? "Sending..." : "Send Reply"}
                </button>
            </div>
        </div>
    );
}
