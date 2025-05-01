// src/components/User-View/NavItems.jsx
import React from "react";
import { NavLink } from "react-router";
import { motion } from "framer-motion";

const userViewNavItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "talentlist", label: "Talent List", path: "/talentlist" },
  { id: "apply-talent", label: "Apply as Talent", path: "/apply-talent" },
  { id: "messages", label: "Messages", path: "/my-profile" }, // Add this
  { id: "about", label: "About", path: "/about" },
  { id: "contact", label: "Contact", path: "/contact" },
];

const NavItems = ({ isMobile = false, onClose }) => {
  const linkVariants = {
    hover: {
      scale: 1.05,
    },
  };

  return (
    <nav
      className={`flex ${
        isMobile ? "flex-col space-y-4" : "flex-row space-x-15"
      }`}
    >
      {userViewNavItems.map((navItem) => (
        <NavLink
          key={navItem.id}
          to={navItem.path}
          onClick={onClose}
          className={({ isActive }) =>
            `relative rounded px-3 py-1 transition-all duration-300
            text-gray-700 text-sm sm:text-base font-medium ${
              isActive ? "bg-green-100" : "hover:bg-green-100"
            } ${isMobile ? "text-lg" : ""}`
          }
        >
          {({ isActive }) => (
            <motion.div
              variants={linkVariants}
              whileHover="hover"
              animate={isActive ? "active" : ""}
              className="flex items-center relative"
            >
              {navItem.label}

              {/* Animated Underline */}
              <motion.div
                className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-green-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavItems;