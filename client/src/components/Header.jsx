"use client"
import { Link } from "react-router-dom"
import { useModal } from "../Appwrapper"
import LoginFormContent from "../pages/Login/Login"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import Button from "../components/Button"
import { useState, useEffect } from "react"

export default function Header() {
  const { openModal } = useModal()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleOpenModal = (type) => {
    let title = ""
    let body = null
    switch (type) {
      case "login":
        title = "Login"
        body = <LoginFormContent />
        break
      default:
        title = "Unknown"
        body = <p>No content found.</p>
    }
    openModal({
      title,
      body,
    })
  }

  // Navigation items with icons
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gear Shop", path: "/gearshop" },
    { name: "Pet Shop", path: "/petshop" },
    { name: "Booking", path: "/booking" },
    { name: "Contact", path: "/contact" },
  ]

  // Determine opacity classes based on scroll position and hover state
  // Fully visible (opacity-100) when at top of page OR when hovered
  // Semi-transparent (opacity-95) only when scrolled AND not hovered
  const opacityClass = !isScrolled || isHovered ? "opacity-100" : "opacity-50"

  // Determine background color based on scroll position and hover state
  const bgClass = !isScrolled
    ? "bg-white" // Fully opaque when at top
    : isHovered
      ? "bg-white" // Fully opaque when hovered
      : "bg-white/50" // Semi-transparent when scrolled and not hovered

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled ? "shadow-md py-1" : "py-1"} 
        ${bgClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`max-w-7xl mx-auto px-4 flex justify-between items-center ${opacityClass} transition-opacity duration-300`}
      >
        {/* Logo */}
        <Link
          to="/"
          className={`text-xl font-bold text-customPurple tracking-wide flex items-center ${opacityClass} transition-opacity duration-300`}
        >
          <span className="text-2xl mr-1">🐾</span>
          <span className="font-poetsen">PetZone</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center space-x-1 ${opacityClass} transition-opacity duration-300`}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="relative px-4 py-2 text-gray-700 font-medium hover:text-customPurple transition-colors group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-customPurple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className={`flex items-center space-x-2 ${opacityClass} transition-opacity duration-300`}>
          {/* Shopping Cart */}
          <Button
            className="flex items-center justify-center"
            color="#6D7AB5"
            hoverColor="#5A678F"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="ml-1 hidden sm:inline">Cart</span>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-customPurple transition-colors rounded-full hover:bg-gray-100 md:hidden"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Display-Dang */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${!isScrolled || isHovered ? "bg-white" : "bg-white/95"} border-t border-gray-200 shadow-lg animate-fadeIn transition-colors duration-300`}
        >
          <nav className={`flex flex-col py-2 ${opacityClass} transition-opacity duration-300`}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-customPurple transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => {
                  handleOpenModal("login")
                  setIsMobileMenuOpen(false)
                }}
                className="text-gray-700 hover:text-customPurple transition-colors flex items-center"
              >
                <User className="w-5 h-5 mr-2" />
                Login
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
