import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate, Link } from "react-router"; // Add Link for navigation
import AuthForm from "@/components/Auth/AuthForm";
import InputField from "@/components/Auth/InputField";
import logo from "../../assets/logo.png";
import Loader from "@/components/Loader/Loader";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const role = response.user.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "talent") {
        navigate("/talent/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (isLoading) {
    return <Loader text="Signing in..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
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
        subtitle="Sign in to access your opportunities"
        onSubmit={handleSubmit}
        buttonText="Sign In"
        isLoading={isLoading}
        error={error}
        footer={
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="font-medium text-white hover:text-gray-300 transition-colors duration-200"
              >
                Sign up
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
        {/* Forgot Password Link */}
        <div className="text-right mt-2">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        </div>
      </AuthForm>
    </div>
  );
};

export default Login;