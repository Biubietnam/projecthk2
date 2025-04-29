// Thuc
import { Link } from "react-router-dom";
import React from "react";
import { useModal } from "../Appwrapper";
import FeedbackFormContent from "./Feedback";
import AskAI from "./AskAI";

export default function Footer() {
    const { openModal } = useModal();

    const handleOpenModal = (type) => {
        let title = "", body = null;
        switch (type) {
            case "feedback":
                title = "Feedback";
                body = <FeedbackFormContent />;
                break;
            case "askAI":
                title = "Ask AI";
                body = <AskAI />;
                break;
            default:
                title = "Unknown";
                body = <p>No content found.</p>;
        }
        openModal({ title, body, showConfirm: false });
    };

    return (
        <footer className="bg-customPurpleDark text-white pt-10 pb-6 mt-16">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h2 className="text-lg mb-3">Pet Store</h2>
                    <p className="text-sm text-gray-100">
                        We provide the best products and services for your beloved pets.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg mb-3">Quick Links</h2>
                    <ul className="space-y-2 text-sm text-gray-100">
                        <li><Link to="/" className="hover:text-gray-300 transition">Home</Link></li>
                        <li><Link to="/contact" className="hover:text-gray-300 transition">Contact Us</Link></li>
                        <li><button onClick={() => handleOpenModal("feedback")} className="hover:text-gray-300 transition">Feedback</button></li>
                        <li><button onClick={() => handleOpenModal("askAI")} className="hover:text-gray-300 transition">Ask-AI</button></li>
                        <li><Link to="/products" className="hover:text-gray-300 transition">Products</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg mb-3">Connect</h2>
                    <ul className="space-y-2 text-sm text-gray-100">
                        <li>Email: info@petstore.com</li>
                        <li>Phone: (555) 123-4567</li>
                        <li>
                            <div className="flex space-x-4 mt-2">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                      className="underline hover:text-gray-300 transition-colors duration-200"
                                >
                                    Facebook
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                      className="underline hover:text-gray-300 transition-colors duration-200"
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://x.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                      className="underline hover:text-gray-300 transition-colors duration-200"
                                >
                                    X
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white mt-10 pt-4 text-sm text-white text-center">
                &copy; {new Date().getFullYear()} PetStore. All rights reserved.
            </div>
        </footer>
    );
}
