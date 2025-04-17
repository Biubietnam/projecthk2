//Thuc
import React from "react";
import { useModal } from "../../Appwrapper";
import LoginFormContent from "./Login";
import Button from "../../components/Button";

export default function ForgotPasswordFormContent() {
  const { openModal } = useModal();
  const handleOpenModal = (type) => {
    let title = "";
    let body = null;
    switch (type) {
      case "login":
        title = "Login";
        body = <LoginFormContent />;
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
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">Forgot Password</h1>
      <p className="text-sm text-gray-500 text-center mb-6">Enter your email to reset your password</p>

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
          <Button position="center" width="full">Send Reset Link</Button>
        </div>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Remembered your password?{" "}
        <button onClick={() => handleOpenModal("login")} className="text-blue-600 underline">
          Back to Login
        </button>
      </p>
    </div>
  );
}
