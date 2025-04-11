import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";
import AuthForm from "@/components/Auth/AuthForm";
import InputField from "@/components/Auth/InputField"; // Adjust the path as needed
import logo from "../../assets/logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
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

      <AuthForm
        logo={<img className="w-[15rem]" src={logo} alt="SkillConnect Logo" />}
        subtitle="Connect with top talent and opportunities"
        onSubmit={handleSubmit}
        buttonText="Create Account"
        isLoading={isLoading}
        error={error}
        footer={
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-medium text-white hover:text-gray-300 transition-colors duration-200"
              >
                Sign in
              </a>
            </p>
            <div className="mt-6 text-sm text-gray-500">
              © {new Date().getFullYear()} SkillConnect. All rights reserved.
            </div>
          </div>
        }
      >
        <InputField
          label="Full Name"
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        <InputField
          label="Email Address"
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
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

        <InputField
          label="Password"
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
      </AuthForm>
    </div>
  );
};

export default Register;