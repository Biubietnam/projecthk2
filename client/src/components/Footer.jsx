// Thuc 
import React from "react";
import { useModal } from "../Appwrapper";
import ContactFormContent from "../pages/Contact";

export default function Footer() {
    const { openModal } = useModal();
    const handleOpenModal = (type) => {
        let title = "";
        let body = null;
        switch (type) {
            case "contact":
                title = "Contact";
                body = <ContactFormContent />;  
                break;
            default:
                title = "Unknown";
                body = <p>No content found.</p>;
        }
        openModal({
            title,
            body,
            showConfirm: false,
        });
    };
    return (
        <footer className="bg-[#5A678F] text-white py-6">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-center sm:text-left">
                    &copy; {new Date().getFullYear()} Your Website. All rights reserved.
                </p>

                <div className="mt-4 sm:mt-0 flex space-x-6">
                    <a href="#" className="hover:text-gray-400 text-sm transition-colors duration-200">
                        About
                    </a>
                    <button onClick={() => handleOpenModal("contact")} className="hover:text-gray-400 text-sm transition-colors duration-200">
                        Contact
                    </button>
                    <a href="#" className="hover:text-gray-400 text-sm transition-colors duration-200">
                        Privacy
                    </a>
                </div>
            </div>
        </footer>
    );
}
