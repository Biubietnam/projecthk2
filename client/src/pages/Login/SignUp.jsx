//Thuc 
import React, { useState } from "react";
import Button from "../../components/Button";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignUpFormContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8002/api/register",
        {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }
      );

      setMessage(res.data.message || "Registration successful!");
      setMessageType("success");
    } catch (err) {
      console.log("Error object:", err);
      setMessage(err.response?.data?.message || "Registration failed!");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">Create an Account</h1>
        <p className="text-sm text-gray-500 text-center mb-3">Please fill in the form to register</p>

        {message && (
          <div
            className={`mb-2 text-center font-semibold ${messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSignUp} >
          <div>
            <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div>
            <Button
              position="center"
              width="full"
              type="submit"
              disabled={isLoading}
              className={`flex justify-center items-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-customPurple hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
