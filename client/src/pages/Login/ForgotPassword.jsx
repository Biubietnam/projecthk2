//Thuc
import React from "react";
import Button from "../../components/Button";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPasswordFormContent() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState(null);
  const [messageType, setMessageType] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8002/api/forgot",
        {
          email,
        }
      );
      setMessage(res.data.message || "Password reset link sent!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong!");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-700 text-center mb-2">Enter your email</h1>
          <p className="text-sm text-gray-500 text-center mb-3">to reset your password</p>
          {message && (
            <div className={`mb-3 text-center font-semibold ${messageType === "success" ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </div>

        <form className="space-y-5" onSubmit={handleForgotPassword}>
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
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-customPurple hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
