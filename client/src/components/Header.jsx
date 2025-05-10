"use client";
//Thuc
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import Button from "../components/Button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("user_info");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gear Shop", path: "/gearshop" },
    { name: "Pet Shop", path: "/petshop" },
    { name: "Booking", path: "/booking" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled ? "backdrop-blur-lg bg-white/80 shadow-md py-1" : "bg-white py-1"}
    `}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-customPurple tracking-wide flex items-center"
        >
          <span className="text-2xl mr-1">🐾</span>
          <span className="font-poetsen">PetZone</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative px-4 py-2 font-medium transition-colors group ${location.pathname === item.path
                ? "text-customPurple"
                : "text-gray-700 hover:text-customPurple"
                }`}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-customPurple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          ))}

          {userInfo && userInfo.role?.name === "admin" && (
            <Link
              to="/admin/dashboard"
              className={`relative px-4 py-2 font-medium transition-colors group ${location.pathname === "/admin/dashboard"
                ? "text-customPurple"
                : "text-gray-700 hover:text-customPurple"
                }`}
            >
              Admin Dashboard
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-customPurple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          )}

          {userInfo ? (
            <div className="relative flex items-center">
              <button
                className="flex items-center text-gray-700 hover:text-customPurple transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User className="w-5 h-5 mr-2" />
                {userInfo.role?.name.charAt(0).toUpperCase() + userInfo.role?.name.slice(1)}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                  {userInfo.role?.name === "admin" && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center text-gray-700 hover:text-customPurple transition-colors">
              <User className="w-5 h-5 mr-2" />
              Login
            </Link>
          )}

          <Link to={"/cart"} className={`relative px-4 py-2 font-medium transition-colors group ${location.pathname === "/admin/dashboard"
            ? "text-customPurple"
            : "text-gray-700 hover:text-customPurple"
            }`}>
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-customPurple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
        </nav>

        <div className="flex md:hidden items-center space-x-2">
          <Button
            className="flex items-center justify-center"
            color="#6D7AB5"
            hoverColor="#5A678F"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-customPurple transition-colors rounded-full hover:bg-gray-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-customPurple"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {userInfo ? (
                <>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                  {userInfo.role?.name === "admin" && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </>
              ) : (
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
