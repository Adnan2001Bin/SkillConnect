import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router"; // Use Link for navigation
import { toast } from "react-toastify";
import AuthForm from "@/components/Auth/AuthForm";
import InputField from "@/components/Auth/InputField";
import logo from "../../assets/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP and new password
  const navigate = useNavigate();

  // Handle sending OTP
  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/send-reset-otp`,
        { email }
      );

      if (response.data.success) {
        toast.success("OTP sent to your email.");
        setStep(2); // Move to the next step
      } else {
        toast.error(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  // Handle resetting password
  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`,
        { email, otp, newPassword }
      );

      if (response.data.success) {
        toast.success("Password reset successfully.");
        navigate("/auth/login"); // Redirect to login page
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70"></div>
        <img
          src="https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Abstract dark workspace"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {step === 1 ? (
        // Step 1: Enter email to receive OTP
        <AuthForm
          logo={<img className="w-[15rem]" src={logo} alt="SkillConnect Logo" />}
          subtitle="Enter your email to receive a password reset OTP"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendOtp();
          }}
          buttonText="Send OTP"
          footer={
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Remember your password?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-white hover:text-gray-300 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
              <div className="mt-6 text-sm text-gray-500">
                © {new Date().getFullYear()} SkillConnect. All rights reserved.
              </div>
            </div>
          }
        >
          <InputField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </AuthForm>
      ) : (
        // Step 2: Enter OTP and new password
        <AuthForm
          logo={<img className="w-[15rem]" src={logo} alt="SkillConnect Logo" />}
          subtitle="Enter the OTP and your new password"
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
          buttonText="Reset Password"
          footer={
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Remember your password?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-white hover:text-gray-300 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
              <div className="mt-6 text-sm text-gray-500">
                © {new Date().getFullYear()} SkillConnect. All rights reserved.
              </div>
            </div>
          }
        >
          <InputField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled
            icon={
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <InputField
            label="OTP"
            id="otp"
            name="otp"
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
          />
          <InputField
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </AuthForm>
      )}
    </div>
  );
};

export default ForgotPassword;