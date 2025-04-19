import React from "react";
import Button from "../components/Button";

export default function Contact() {
  return (
    <div className="text-gray-700 min-h-screen py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p>We’re here to help with all your pet care needs</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4">
        <div className="p-6 rounded-lg shadow-md">
          <h2 className="text-xl mb-4 font-semibold">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-700 rounded"
                placeholder="John Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-700 rounded"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone (optional)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-700 rounded"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Subject</label>
              <select className="w-full p-2 border border-gray-700 rounded">
                <option>Select a subject</option>
                <option>Appointments</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                className="w-full p-2 h-24 border border-gray-700 rounded"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <Button position="center" width="full" className="mt-3 px-4 py-2 rounded">
              Send Message
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className=" p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><strong>Phone:</strong> (555) 123-4567</li>
              <li><strong>Email:</strong> info@petcare.com</li>
              <li><strong>Address:</strong> 123 Main Street, New York, NY 10001</li>
              <li>
                <strong>Business Hours:</strong><br />
                Mon–Fri: 9:00 AM – 5:00 PM<br />
                Sat: 9:00 AM – 3:00 PM<br />
                Sun: Closed
              </li>
            </ul>
          </div>

          <div className=" p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Emergency Services</h2>
            <p className="text-sm text-gray-500">
              Emergency Phone: (555) 987-6543<br />
              Our emergency line is available 24/7 for urgent pet care needs.
            </p>
            <Button position="center" width="full" className="mt-3 text-sm">
            Emergency Instructions
            </Button>
          </div>

          <div className=" p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">FAQs</h2>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><strong>Do you offer house calls?</strong><br />Yes, please call our office.</li>
              <li><strong>What payment methods?</strong><br />Cash, credit, debit, pet insurance.</li>
              <li><strong>Do I need appointment?</strong><br />Recommended for routine visits.</li>
            </ul>
            <button className="mt-3 px-4 py-1 text-customPurple text-sm hover:underline">
              View All FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
