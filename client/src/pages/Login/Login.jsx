// Thuc 
import React from "react";
import { useModal } from "../../Appwrapper";
import ForgotPasswordFormContent from "./ForgotPassword";
import SignUpFormContent from "./SignUp";
import  Button from "../../components/Button";
export default function LoginFormContent() {
  const { openModal } = useModal();
  const handleOpenModal = (type) => {
    let title = "";
    let body = null;
    switch (type) {
      case "forgotPassword":
        title = "Forgot Password";
        body = <ForgotPasswordFormContent />;
        break;
      case "signup":
        title = "Sign Up";
        body = <SignUpFormContent />;
        break;
      default:
        title = "Unknown";
        body = <p>No content found.</p>;
    }
    openModal({
      title,
      body,
      showConfirm: false,
    });
  }
  return (
    <div className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">Welcome Back</h1>
      <p className="text-sm text-gray-500 text-center mb-6">Please sign in to your account</p>

      <form className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
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
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            <span>Remember me</span>
          </label>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal("forgotPassword");
            }}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <div className="flex justify-center">
          <Button position="center" width="full">Sign In</Button>
        </div>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Don't have an account?{" "}
        <button
          onClick={() => handleOpenModal("signup")}
          className="text-blue-600 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

