// src/components/Talent-View/SideBar.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router";

// Animation variants for the sidebar
const sidebarVariants = {
  expanded: { width: "250px" },
  collapsed: { width: "80px" },
};

// Animation variants for sidebar items
const itemVariants = {
  expanded: { opacity: 1, x: 0 },
  collapsed: { opacity: 0, x: -20 },
};

const TalentSideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const menuItems = [
    { name: "Dashboard", path: "/talent/dashboard" },
    { name: "Profile", path: "/talent/profile" },
    { name: "Gigs", path: "/talent/gigs" },
    { name: "Messages", path: "/talent/messages" },
    { name: "Settings", path: "/talent/settings" },
  ];

  return (
    <motion.div
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#64748B] text-[#F3F4F6] shadow-lg z-40 overflow-hidden"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="p-4 flex justify-end">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </motion.svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial="collapsed"
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={itemVariants}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-4 py-3 px-4 my-2 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-[#9CA3AF]" : "hover:bg-[#9CA3AF]"
                  }`
                }
              >
                {/* Icon */}
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
                      item.name === "Dashboard"
                        ? "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        : item.name === "Profile"
                        ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        : item.name === "Gigs"
                        ? "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        : item.name === "Messages"
                        ? "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        : "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
                    }
                  />
                </svg>
                {/* Link Text */}
                {isExpanded && (
                  <span className="text-sm sm:text-base font-medium">
                    {item.name}
                  </span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        {isExpanded && (
          <motion.div
            className="p-4 text-center text-xs sm:text-sm text-[#D1D5DB]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © 2025 TalentHub
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TalentSideBar;