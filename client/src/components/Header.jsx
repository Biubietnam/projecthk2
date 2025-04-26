// Thuc
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import Button from "../components/Button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = 3;
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    console.log("Logged out");
    setIsAuthenticated(false);
  };

  const handleClickOutside = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setIsUserMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <NavLink
            to="/"
            className="text-2xl sm:text-3xl font-bold text-customPurple tracking-wide"
          >
            PetZone
          </NavLink>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-2xl"
          >
            ☰
          </button>

          <nav
            className={`${isMobileMenuOpen ? "block" : "hidden"
              } sm:block absolute sm:static top-full left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow sm:shadow-none px-4 sm:px-0 py-4 sm:py-0`}
          >
            <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm font-medium">
              <li>
                <NavLink
                  to="/gearshop"
                  className={({ isActive }) =>
                    isActive
                      ? "text-customPurple underline"
                      : "text-gray-700 hover:underline transition"
                  }
                >
                  Gear Shop
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive
                      ? "text-customPurple underline"
                      : "text-gray-700 hover:underline transition"
                  }
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/booking"
                  className={({ isActive }) =>
                    isActive
                      ? "text-customPurple underline"
                      : "text-gray-700 hover:underline transition"
                  }
                >
                  Booking
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4 relative">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-700 hover:text-customPurple transition"
                >
                  <User className="w-6 h-6" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                    <NavLink
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </NavLink>
                    <NavLink
                      to="/favorites"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Favorites
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="text-gray-700 hover:text-customPurple transition"
              >
                Login
              </NavLink>
            )}

            <Button className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-yellow-100 text-yellow-800 text-center text-sm py-2">
        Free shipping on orders over $50!
      </div>
    </>
  );
}
