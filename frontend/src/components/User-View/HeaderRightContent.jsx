// src/components/User-View/UserHeaderRightContent.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ChevronDown, LogOut, UserCog } from "lucide-react";

const UserHeaderRightContent = ({ isMobile = false }) => {
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const emailInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : "NA"; 

  // Animation variants
  const buttonVariants = {
    hover: {
      scale: 1.03,
      backgroundColor: isMobile ? "#16A34A" : "#E5E7EB",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: { scale: 0.98 },
  };

  const avatarVariants = {
    hover: {
      scale: 1.03,
      opacity: 0.9,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const chevronVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  const dropdownVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  // Toggle dropdown state
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div
      className={`flex items-center ${
        isMobile ? "flex-col space-y-4 w-full" : "flex-row space-x-4"
      }`}
    >
      {isAuthenticated && user ? (
        <DropdownMenu onOpenChange={setIsDropdownOpen}>
          <div className="flex items-center gap-2">
            <DropdownMenuTrigger asChild>
              <motion.div
                variants={avatarVariants}
                whileHover="hover"
                onClick={toggleDropdown}
              >
                <Avatar className="bg-green-500 h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarFallback className="bg-green-500 text-white font-medium">
                    {emailInitials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuTrigger asChild>
              <motion.div
                variants={chevronVariants}
                animate={isDropdownOpen ? "open" : "closed"}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={toggleDropdown}
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </motion.div>
            </DropdownMenuTrigger>
          </div>
          <AnimatePresence>
            {isDropdownOpen && (
              <DropdownMenuContent
                side="bottom"
                align={isMobile ? "center" : "end"}
                className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg"
              >
                <motion.div
                  variants={dropdownVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <DropdownMenuLabel className="text-gray-700 font-medium">
                    {user.name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={() => navigate("/my-profile")}
                    className="text-gray-700 hover:bg-green-50 hover:text-green-500 focus:bg-green-50 focus:text-green-500 cursor-pointer"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="text-gray-700 hover:bg-green-50 hover:text-green-500 focus:bg-green-50 focus:text-green-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoading ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            )}
          </AnimatePresence>
        </DropdownMenu>
      ) : (
        <>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/auth/login"
              className={`${
                isMobile ? "w-full text-center" : "px-3 sm:px-4"
              } py-2 border border-green-500 text-green-500 rounded-lg font-medium text-sm sm:text-base hover:bg-green-50`}
            >
              Login
            </Link>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/auth/register"
              className={`${
                isMobile ? "w-full text-center" : "px-3 sm:px-4"
              } py-2 bg-green-500 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-green-600`}
            >
              Sign Up
            </Link>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default UserHeaderRightContent;