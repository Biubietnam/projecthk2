//Thuc
import React, { useState } from "react";
import { useModal } from "../../Appwrapper";
import LoginFormContent from "./Login";
import Button from "../../components/Button";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordFormContent() {
    const { openModal } = useModal();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const navigate = useNavigate();
    const { token } = useParams();


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
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8000/api/reset",
                {
                    email,
                    password,
                    password_confirmation: confirmPassword,
                    token,
                }
            );

            setMessage(res.data.message || "Password reset successful!");
            setMessageType("success");
            setTimeout(() => {
                navigate("/");
            }, 10000);
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Something went wrong!");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-semibold text-gray-700 text-center mb-2">Reset Password</h1>
                <p className="text-sm text-gray-500 text-center mb-4">Enter your new password</p>
                {message && (
                    <div
                        className={`mb-3 text-center font-semibold ${messageType === "success" ? "text-green-600" : "text-red-600"}`}
                    >
                        {message}
                    </div>
                )}
                <form onSubmit={handleResetPassword} className="space-y-5">
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
                        <label htmlFor="password" className="block text-sm text-gray-600 mb-1">New Password</label>
                        <input
                            type="password"
                            id="password"
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
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                "Reset Password"
                            )}
                        </Button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-500 mt-6">
                    Remembered your password?{" "}
                    <button onClick={() => handleOpenModal("login")} className="text-blue-500 hover:underline">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
}