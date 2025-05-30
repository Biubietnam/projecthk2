// Thuc
import React from "react";
import Button from "./Button";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function FeedbackFormContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://thoriumstudio.xyz/api/feedback", formData);
      if (response.status === 201) {
        alert("Feedback submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting your feedback.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md rounded-2xl p-6 sm:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">Feedback</h1>
      <p className="text-sm text-gray-500 text-center mb-6">We'd love to hear from you</p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm text-gray-600 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          ></textarea>
        </div>

        <div>
          <Button position="center" width="full" type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin h-4 w-4" />
              </div>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
