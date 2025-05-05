//Thuc
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Users, ShoppingCart, Package, Dog } from "lucide-react";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user_info"));

    useEffect(() => {
        if (!user || user.role?.name !== "admin") {
            navigate("/");
        }
    }, []);

    function AdminCard({ icon: Icon, title, desc, to }) {
        return (
            <Link to={to} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition hover:bg-gray-50 cursor-pointer flex flex-col gap-2">
                <Icon className="text-customPurple w-6 h-6" />
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-gray-600">{desc}</p>
            </Link>
        );
    }

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminCard icon={Users} title="User Management" desc="Manage user roles and permissions." to="/admin/usermanagement" />
                <AdminCard icon={ShoppingCart} title="Orders Management" desc="Track and manage orders." to="/admin/ordermanagement" />
                <AdminCard icon={Package} title="Gears Management" desc="Manage product listings." to="/admin/gearmanagement" />
                <AdminCard icon={Dog} title="Pets Management" desc="Manage pet information." to="/admin/petmanagement" />
            </div>
        </div>
    );
}
