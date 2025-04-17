// Thuc
import React from "react";
import Button from "../components/Button";
export default function ContactFormContent() {
  return (
    <div className="w-full max-w-md rounded-2xl p-6 sm:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">Contact Us</h1>
      <p className="text-sm text-gray-500 text-center mb-6">We'd love to hear from you</p>

      <form className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
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
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm text-gray-600 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          ></textarea>
        </div>

        <div>
        <Button position="center" width="full">Seen Message</Button>
        </div>
      </form>
    </div>
  );
}
