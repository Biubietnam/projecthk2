//Thuc
import React from "react";
import { Link } from "react-router-dom";
import { useModal } from "../Appwrapper";
import ContactFormContent from "../pages/Contact";
import LoginFormContent from "../pages/Login/Login";
import AboutUsContent from "../pages/AboutUs";

export default function Header() {
    const { openModal } = useModal();
    const handleOpenModal = (type) => {
        let title = "";
        let body = null;
        switch (type) {
            case "contact":
                title = "Contact";
                body = <ContactFormContent />;
                break;
            case "login":
                title = "Login";
                body = <LoginFormContent />;
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
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-[#5A678F] tracking-wide">
                    PetZone
                </Link>

                <nav>
                    <ul className="flex gap-6 text-sm font-medium">
                        <li>
                            <button
                                onClick={() => handleOpenModal("contact")}
                                className="text-[#5A678F] hover:underline transition"
                            >
                                Contact
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleOpenModal("login")}
                                className="text-[#5A678F] hover:underline transition"
                            >
                                Login
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="flex items-center space-x-4">
                    <button className="text-sm text-[#5A678F] hover:underline">Login</button>
                    <button className="bg-[#5A678F] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#4a5778] transition">
                        Cart
                    </button>
                </div>
            </div>
        </header>
    );
}
