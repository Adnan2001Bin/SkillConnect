// src/components/Talent-View/Header.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import Loader from "../Loader/Loader";
import { buttonVariants } from "@/utils/Admin/animationVariants";

const TalentHeader = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return <Loader text="Logging out..." />;
  }

  // Extract the first two letters of the user's email
  const emailInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : "NA"; 

  // Animation variants for the header
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.header
      className="sticky top-0 z-50 bg-gradient-to-r from-medium-teal to-very-light-teal shadow-lg"
      style={{
        background: "linear-gradient(to right, #98c2bd, #c4edda)",
      }}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <div className="text-2xl sm:text-3xl font-bold text-off-white">
          <h1 className="text-sm sm:text-lg font-semibold text-white bg-black w-32 sm:w-36 h-10 sm:h-12 flex items-center justify-center rounded-3xl">
            Talent Panel
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className="flex items-center gap-2"
          >
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-sm sm:text-base">{emailInitials}</span>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white bg-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <FaSignOutAlt className="text-lg sm:text-xl" />
            )}
            <span>{isLoading ? "Logging out..." : "Logout"}</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default TalentHeader;