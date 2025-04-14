// src/components/User-View/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import logo from "../../assets/logo.png";

// Social media icons (using Heroicons as an example; replace with your preferred icons)
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.footer
      className="bg-[#1A3C34] text-white py-12"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Branding Section */}
          <div>
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="SkillConnect Logo"
                className="w-20 sm:w-24 lg:w-28 h-auto"
              />
            </Link>
            <p className="text-sm sm:text-base text-gray-300 mt-2">
              Connecting you with top talent to bring your projects to life.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* User Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/for-clients"
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  For Clients
                </Link>
              </li>
              <li>
                <Link
                  to="/for-talents"
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  For Talents
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@skillconnect.com"
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  support@skillconnect.com
                </a>
              </li>
              <li className="flex space-x-4 mt-4">
                <a
                  href="https://twitter.com/skillconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="https://linkedin.com/company/skillconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="https://facebook.com/skillconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                >
                  <FaFacebook size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-300 mb-4 sm:mb-0">
            © 2025 SkillConnect. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com/skillconnect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-green-400 transition-colors duration-200"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://linkedin.com/company/skillconnect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-green-400 transition-colors duration-200"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://facebook.com/skillconnect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-green-400 transition-colors duration-200"
            >
              <FaFacebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
