import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown, ChevronUp, Home, ShoppingBag, Calendar, Phone, User } from "lucide-react"
import Button from "./Button"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mobile-sidebar")
      const toggleButton = document.getElementById("sidebar-toggle")

      if (sidebar && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Close sidebar when route changes
    setIsOpen(false)

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [location.pathname])

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  const navItems = [
    {
      title: "Home",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Shop",
      path: "/gearshop",
      icon: <ShoppingBag className="w-5 h-5" />,
      active: location.pathname.includes("/gearshop") || location.pathname.includes("/product"),
      subItems: [
        { title: "Gear Shop", path: "/gearshop" },
        { title: "Pet Shop", path: "/petshop" },
      ],
    },
    {
      title: "Booking",
      path: "/booking",
      icon: <Calendar className="w-5 h-5" />,
      active: location.pathname.includes("/booking"),
      subItems: [
        { title: "Pet Vet", path: "/petVet" },
        { title: "Pet Grooming", path: "/petGrooming" },
        { title: "Pet Event", path: "/petEvent" },
        { title: "Pet Advice", path: "/petAdvice" },
      ],
    },
    {
      title: "Contact",
      path: "/contact",
      icon: <Phone className="w-5 h-5" />,
      active: location.pathname === "/contact",
    },
    {
      title: "Account",
      path: "/account",
      icon: <User className="w-5 h-5" />,
    },
  ]

  const isActive = (item) => {
    if (item.active) return true
    return location.pathname === item.path
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden">
        <Button
          id="sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2"
          color="#6D7AB5"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl  text-customPurple">PetZone</h2>
          <Button onClick={() => setIsOpen(false)} className="p-1" color="#6D7AB5" aria-label="Close Menu">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index} className="py-1">
                {item.subItems ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center justify-between w-full p-2 rounded-md ${
                        isActive(item) ? "bg-customPurple text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </div>
                      {activeDropdown === index ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {activeDropdown === index && (
                      <ul className="pl-6 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block p-2 rounded-md ${
                                location.pathname === subItem.path
                                  ? "bg-customPurple/10 text-customPurple font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-md ${
                      isActive(item) ? "bg-customPurple text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop Sidebar - Shown as horizontal navbar */}
      <div className="hidden lg:block w-full">
        <nav className="flex justify-center">
          <ul className="flex space-x-6">
            {navItems.map((item, index) => (
              <li key={index} className="relative group">
                {item.subItems ? (
                  <div className="relative">
                    <button
                      className={`flex items-center px-3 py-2 rounded-md ${
                        isActive(item) ? "text-customPurple font-medium" : "hover:text-customPurple"
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>

                    <div className="absolute left-0 z-10 w-48 mt-1 origin-top-left bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <ul className="py-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block px-4 py-2 text-sm ${
                                location.pathname === subItem.path
                                  ? "bg-customPurple/10 text-customPurple font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`block px-3 py-2 rounded-md ${
                      isActive(item) ? "text-customPurple font-medium" : "hover:text-customPurple"
                    }`}
                  >
                    {item.title}
                  </Link>
                )}
                {isActive(item) && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-customPurple"></span>}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
