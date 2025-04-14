// src/components/User-View/Header.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router"; // Fixed import
import logo from "../../assets/logo3.png";
import NavItems from "./NavItems";
import UserHeaderRightContent from "./HeaderRightContent";
import { FaBars, FaTimes } from "react-icons/fa";

const UserHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.img
            src={logo}
            alt="SkillConnect Logo"
            className="w-20 sm:w-24 lg:w-28 h-auto" // Adjusted size
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:block">
          <NavItems />
        </div>

        {/* Right Content */}
        <div className="hidden lg:flex items-center">
          <UserHeaderRightContent />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
      >
        <div className="px-4 py-6 sm:px-6">
          <NavItems isMobile onClose={toggleMobileMenu} />
          <div className="mt-6">
            <UserHeaderRightContent isMobile />
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default UserHeader;