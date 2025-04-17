"use client"

const Button = ({
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  width = "auto",
  position = "left",
  color = "#6D7AB5",
  textColor = "white",
  hoverColor = "#5A678F",
  ...props
}) => {
  // Width classes based on the width prop
  const widthClasses = width === "full" ? "w-full" : width === "auto" ? "w-auto" : `w-[${width}]`

  // Position classes based on the position prop
  const positionClasses =
    position === "center" ? "mx-auto" : position === "right" ? "ml-auto" : position === "left" ? "mr-auto" : ""

  // Create style object for custom colors
  const buttonStyle = {
    backgroundColor: color,
    color: textColor,
    // We'll handle hover effects with JavaScript
  }

  // Create hover style object
  const hoverStyle = {
    backgroundColor: hoverColor,
    boxShadow: `0 10px 15px -3px ${color}30`,
  }

  // Handle hover events
  const handleMouseEnter = (e) => {
    if (!disabled) {
      Object.assign(e.currentTarget.style, hoverStyle)
      e.currentTarget.style.transform = "translateY(0px) scale(1.01)"
    }
  }

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = color
      e.currentTarget.style.boxShadow = "none"
      e.currentTarget.style.transform = "translateY(0) scale(1)"
    }
  }

  return (
    <button
      type={type}
      className={`
        font-medium 
        py-2 
        px-4 
        rounded-md
        transition-all
        duration-300
        ease-in-out
        focus:outline-none 
        focus:ring-2
        focus:ring-opacity-50
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${widthClasses}
        ${positionClasses}
        ${className}
      `}
      style={{
        ...buttonStyle,
        // Set focus ring color dynamically
        "--focus-ring-color": color,
      }}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
