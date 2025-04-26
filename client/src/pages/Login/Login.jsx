// Thuc
import React, { useState } from "react";
import Button from "../../components/Button";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);


  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const res = await axios.post(
        "http://localhost:8000/api/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setMessage(res.data.message || "Login successful!");
      setMessageType("success");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Login Error:", err);
      setMessage(err.response?.data?.message || "Login failed!");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-2">Welcome Back</h1>
        <p className="text-sm text-gray-500 text-center mb-4">Please sign in to your account</p>

        {message && (
          <div
            className={`mb-3 text-center font-semibold ${messageType === "success" ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              id="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4 accent-customPurple" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-customPurple hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              width="full"
              position="center"
              disabled={isLoading}
              className={`flex justify-center items-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-customPurple hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
