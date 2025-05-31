//Thuc
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Users, ShoppingCart, Package, PawPrint, HeartHandshake, MessageSquare, Mail, CalendarClock, Home } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const token = localStorage.getItem("access_token");
                await axios.get(
                    "http://localhost:8000/api/admin",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } catch (err) {
                navigate("/");
            }
        };

        checkAdmin();
    }, [navigate]);

    function AdminCard({ icon: Icon, title, desc, to }) {
        return (
            <Link to={to} className="
    group
    bg-white 
    p-6 
    rounded-2xl 
    shadow-sm 
    hover:shadow-md 
    transition 
    hover:bg-gray-50 
    border 
    border-gray-100 
    flex flex-col gap-2
    focus:outline-none focus:ring-2 focus:ring-customPurpleDark
">
                <Icon className="text-customPurpleDark w-6 h-6 transition-transform group-hover:scale-105" />
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-gray-500 text-sm">{desc}</p>
            </Link>

        );
    }

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                <h1 className="text-3xl text-gray-900 tracking-tight">Admin Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                <AdminCard icon={Users} title="User Management" desc="Manage user roles and permissions." to="/admin/usermanagement" />
                <AdminCard icon={ShoppingCart} title="Orders Management" desc="Track and manage orders." to="/admin/ordermanagement" />
                <AdminCard icon={Package} title="Gears Management" desc="Manage product listings." to="/admin/gearmanagement" />
                <AdminCard icon={PawPrint} title="Pets Management" desc="Manage pet information." to="/admin/petmanagement" />
                <AdminCard icon={HeartHandshake} title="Adoption Management" desc="Manage pet adoption requests." to="/admin/adoptionmanagement" />
                <AdminCard icon={MessageSquare} title="Feedback Management" desc="Manage user reviews and feedback." to="/admin/feedbackmanagement" />
                <AdminCard icon={Mail} title="Contact Management" desc="Manage contact messages from users." to="/admin/contactmanagement" />
                <AdminCard icon={CalendarClock} title="Booking Management" desc="Manage service bookings and appointments." to="/admin/bookingmanagement" />
            </div>
        </div>
    );
}
