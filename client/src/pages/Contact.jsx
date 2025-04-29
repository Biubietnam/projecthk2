import React from "react";
import Button from "../components/Button";

export default function Contact() {
  return (
    <div className="text-gray-700 min-h-screen py-10 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p>We’re here to help with all your pet care needs</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4 items-stretch">
        <div className="p-6 rounded-lg border border-customPurple bg-white">
          <h2 className="text-xl font-semibold">Send Us a Message</h2>
          <p className="text-sm text-gray-500 mb-2">Fill out the form below and we'll get back to you as soon as possible</p>
          <form className="space-y-4">
            <div className="text-sm">
              <label className="block mb-1 font-bold text-gray-500">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-700 rounded"
                placeholder="John Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block mb-1 font-bold text-gray-500">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-700 rounded"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-gray-500">Phone (optional)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-700 rounded"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div className="text-sm">
              <label className="block mb-1 font-bold text-gray-500">Subject</label>
              <select className="w-full p-2 border border-gray-700 rounded">
                <option>Select a subject</option>
                <option>Appointments</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>
            <div className="text-sm">
              <label className="block mb-1 font-bold text-gray-500">Message</label>
              <textarea
                className="w-full p-2 h-24 border border-gray-700 rounded"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <Button position="center" width="full" className="mt-3 px-4 py-2 rounded text-sm">
              Send Message
            </Button>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Find Us Here</h2>
            <div className="w-full h-64 rounded overflow-hidden border border-gray-300">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4689.851234228488!2d106.6796292112956!3d10.79090305888078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fcdf5e6b00b%3A0xed1c6762515e1113!2sFPT%20Aptech!5e1!3m2!1svi!2s!4v1745154702691!5m2!1svi!2s"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full justify-between space-y-6">
          <div className=" p-6 rounded-lg border border-customPurple bg-white">
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

          <div className=" p-6 rounded-lg border border-customPurple bg-white">
            <h2 className="text-lg font-semibold mb-2">Emergency Services</h2>
            <p className="text-sm text-gray-500">
              Emergency Phone: (555) 987-6543<br />
              Our emergency line is available 24/7 for urgent pet care needs.
            </p>
            <Button position="center" width="full" className="mt-3 text-sm">
              Emergency Instructions
            </Button>
          </div>

          <div className=" p-6 rounded-lg border border-customPurple bg-white">
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
