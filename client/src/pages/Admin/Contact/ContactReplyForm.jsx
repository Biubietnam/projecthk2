import React, { useState } from "react";
import axios from "axios";
import { Loader, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactReplyForm({ contact, onSuccess }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReply = async () => {
    if (!message.trim()) {
      setError("Reply message cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("access_token");

      await axios.post(`http://localhost:8000/api/admin/contacts/${contact.id}/replies`, {
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Reply sent successfully.");
      onSuccess?.();
    } catch (err) {
      console.error("Error sending reply:", err);
      setSuccess("");
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-[15px] text-gray-800 space-y-5 font-[system-ui] leading-relaxed">
      {/* Animated Alerts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm border border-green-100 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm border border-red-100 text-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipient */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500 uppercase tracking-widest">Recipient</label>
        <div className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          {contact.email}
        </div>
      </div>

      {/* Message */}
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

      {/* Button */}
      <div className="pt-1 text-right">
        <button
          onClick={handleReply}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200 ease-in-out ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </div>
  );
}
