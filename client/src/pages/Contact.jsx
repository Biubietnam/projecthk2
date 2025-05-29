import React, { useState } from "react";
import Button from "../components/Button";
import { Loader } from "lucide-react";
import axios from "axios";
import { Mail } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast';
import { Link, useLocation } from "react-router-dom";
import { useBreakpoint } from "../pages/hooks/useBreakpoint";

function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  const breadcrumbList = [];

  paths.forEach((segment, index) => {
    const path = '/' + paths.slice(0, index + 1).join('/');
    breadcrumbList.push({
      label: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
      to: path,
    });
  });

  return (
    <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-customPurple text-gray-500 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
        </svg>
        Home
      </Link>
      {breadcrumbList.map((item, idx) => (
        <React.Fragment key={item.to}>
          <span className="text-gray-400">/</span>
          {idx === breadcrumbList.length - 1 ? (
            <span className="text-gray-700 font-medium">{item.label}</span>
          ) : (
            <Link to={item.to} className="hover:text-customPurple">{item.label}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const isMobile = useBreakpoint();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/contacts", formData);
      if (response.status === 201) {
        toast.success("Message sent successfully!");
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("An error occurred while sending your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <Toaster
        position={isMobile ? "bottom-center" : "bottom-right"}
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fefefe',
            color: '#333',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            padding: '14px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#10b981', // Emerald
            secondary: '#ECFDF5',
          },
        }}
      />
      <Breadcrumb />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight flex justify-center items-center gap-2">
          <Mail className="w-8 h-8 text-customPurpleDark" />
          Contact Us
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          We're here to help with all your pet care needs
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4 items-stretch">
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold">Send Us a Message</h2>
          <p className="text-sm text-gray-500 mb-2">Fill out the form below and we'll get back to you as soon as possible</p>
          <form className="space-y-4">
            <div className="text-sm">
              <label className="block mb-1  text-gray-500">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 transition"
                placeholder="John Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block mb-1  text-gray-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 transition"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block mb-1  text-gray-500">Phone (optional)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 transition"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div className="text-sm">
              <label className="block mb-1  text-gray-500">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 transition"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Custom Request">Custom Request</option>
                <option value="Emergency">Emergency</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="text-sm">
              <label className="block mb-1  text-gray-500">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 transition"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <Button
              className="w-full py-2 mt-3 text-sm rounded-md flex items-center justify-center"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Find Us Here</h2>
            <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
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
          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
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

          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Emergency Services</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Emergency Phone: (555) 987-6543<br />
              Our emergency line is available 24/7 for urgent pet care needs.
            </p>
            <Button className="mt-4 text-sm">Emergency Instructions</Button>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
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
