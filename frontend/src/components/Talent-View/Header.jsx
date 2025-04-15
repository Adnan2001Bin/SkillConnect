// src/components/Talent-View/Header.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

// Animation variants for the header
const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Animation variants for navigation links
const navLinkVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const TalentHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#D1D5DB] to-[#E5E7EB] text-[#4B5563] shadow-lg z-50"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <motion.div
          className="text-2xl sm:text-3xl font-bold"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link to="/talent" className="flex items-center space-x-2">
            <span className="text-[#4B5563]">TalentHub</span>
            <span className="text-[#374151] text-sm sm:text-base font-normal">
              for Talents
            </span>
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <nav className="hidden sm:flex space-x-6">
          {["Dashboard", "Profile", "Gigs", "Messages", "Settings"].map(
            (link, index) => (
              <motion.div
                key={link}
                custom={index}
                variants={navLinkVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.1, color: "#9CA3AF" }} // Cool Grey on hover
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to={`/talent/${link.toLowerCase()}`}
                  className="text-[#4B5563] hover:text-[#9CA3AF] text-sm sm:text-base font-medium"
                >
                  {link}
                </Link>
              </motion.div>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <button
            className="text-[#4B5563] focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed top-16 left-0 w-full bg-[#64748B] sm:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="flex flex-col p-4 space-y-4">
          {["Dashboard", "Profile", "Gigs", "Messages", "Settings"].map((link) => (
            <Link
              key={link}
              to={`/talent/${link.toLowerCase()}`}
              className="text-[#F3F4F6] hover:text-[#9CA3AF] text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link}
            </Link>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
};

export default TalentHeader;