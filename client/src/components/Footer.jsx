import { Link } from "react-router-dom";
import React from "react";
import { useModal } from "../Appwrapper";
import FeedbackFormContent from "./Feedback";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';

export default function Footer() {
    const { openModal } = useModal();

    const handleOpenModal = (type) => {
        if (type === "feedback") {
            openModal({
                title: "Feedback",
                body: <FeedbackFormContent />,
            });
        }
        else {
            toast.error("Sorry, this feature is not available yet.");
        }
    };

    return (
        <footer className="bg-[#1F2937] text-white mt-20 pt-12 pb-6 text-sm">
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
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {/* Brand & Description */}
                <div>
                    <h2 className="text-xl font-semibold mb-3 tracking-wide">🐾 PetZone</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Bringing love, care, and quality products to your furry friends.
                    </p>
                </div>

                {/* Quick Navigation */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                        <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                        <li><button onClick={() => handleOpenModal("feedback")} className="hover:text-white transition">Feedback</button></li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
                    <ul className="text-gray-300 space-y-1">
                        <li>Email: <a href="mailto:info@petzone.com" className="hover:text-white">info@petzone.com</a></li>
                        <li>Phone: <a href="tel:5551234567" className="hover:text-white">(555) 123-4567</a></li>
                        <li>Hours: <span className="text-gray-100">Mon - Sat: 9:00 AM - 8:00 PM</span></li>
                    </ul>
                    <div className="flex items-center gap-4 mt-4 text-xl">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
                            <FaFacebookF />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
                            <FaInstagram />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
                            <FaXTwitter />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 border-t border-gray-600 pt-4 text-center text-gray-400">
                &copy; {new Date().getFullYear()} PetZone. All rights reserved.
            </div>
        </footer>
    );
}
