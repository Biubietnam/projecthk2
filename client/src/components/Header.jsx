//Thuc
import React from "react";
import { Link } from "react-router-dom";
import { useModal } from "../Appwrapper";
import ContactFormContent from "./Feedback";
import LoginFormContent from "../pages/Login/Login";
import { ShoppingCart } from "lucide-react";
import Button from "../components/Button";

export default function Header() {
    const { openModal } = useModal();
    const handleOpenModal = (type) => {
        let title = "";
        let body = null;
        switch (type) {
            case "feedback":
                title = "Feedback";
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
        });
    };
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-customPurple tracking-wide">
                    PetZone
                </Link>

                <nav>
                    <ul className="flex gap-6 text-sm font-medium">
                        <li>
                            <Link to="/gearshop" className="text-gray-700 hover:underline transition">
                                Gear Shop
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-gray-700 hover:underline transition">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => handleOpenModal("login")}
                        className="text-gray-700 hover:underline transition"
                    >
                        Login
                    </button>
                    <Button>
                        <ShoppingCart className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
