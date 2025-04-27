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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem("user_info");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

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

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gear Shop", path: "/gearshop" },
    { name: "Pet Shop", path: "/petshop" },
    { name: "Booking", path: "/booking" },
    { name: "Contact", path: "/contact" },
  ]

  const opacityClass = !isScrolled || isHovered ? "opacity-100" : "opacity-50"

  const bgClass = !isScrolled
    ? "bg-white"
    : isHovered
      ? "bg-white"
      : "bg-white/50"

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
        <Link
          to="/"
          className={`text-xl font-bold text-customPurple tracking-wide flex items-center ${opacityClass} transition-opacity duration-300`}
        >
          <span className="text-2xl mr-1">🐾</span>
          <span className="font-poetsen">PetZone</span>
        </Link>

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

        <div className={`flex items-center space-x-2 ${opacityClass} transition-opacity duration-300`}>
          <Button
            className="flex items-center justify-center"
            color="#6D7AB5"
            hoverColor="#5A678F"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>

          {userInfo ? (
            <div className="hidden md:flex items-center text-gray-700 hover:text-customPurple transition-colors">
              <User className="w-5 h-5 mr-2" />
              {userInfo.role.name.charAt(0).toUpperCase() + userInfo.role.name.slice(1)}
            </div>
          ) : (
            <Link to={"/login"} className="hidden md:flex items-center text-gray-700 hover:text-customPurple transition-colors">
              <User className="w-5 h-5 mr-2" />
              Login
            </Link>
          )}


          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-customPurple transition-colors rounded-full hover:bg-gray-100 md:hidden"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

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
