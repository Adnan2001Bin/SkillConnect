import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router";
import {
  FaHome,
  FaUser,
  FaProjectDiagram,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { sidebarVariants, navItemVariants } from "@/utils/Talent/animationVariants";

const TalentSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Updated navItems to match your design
  const navItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/talent/dashboard" },
    { name: "Profile", icon: <FaUser />, path: "/talent/profile" },
    { name: "Projects", icon: <FaProjectDiagram />, path: "/talent/projects" },
    { name: "Messages", icon: <FaEnvelope />, path: "/talent/messages" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/talent/logout" },
  ];

  return (
    <motion.aside
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-medium-teal shadow-lg z-40 overflow-hidden"
      style={{ backgroundColor: "#98c2bd" }}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full p-4">
        {/* Toggle Button */}
        <motion.button
          className="self-end text-off-white hover:text-teal mb-4 mt-5"
          style={{ color: "#f1f2f2", "--hover-color": "#4da59b" }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <FaChevronRight size={20} />
          ) : (
            <FaChevronLeft size={20} />
          )}
        </motion.button>

        <div className="mb-4 sm:mb-6">
          <img
            className="w-24 sm:w-32 lg:w-38 mx-auto"
            src={logo}
            alt="SkillConnect Logo"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              custom={index}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="mb-4 px-3 py-2 rounded-lg"
            >
              <NavLink
                to={item.path}
                className="flex items-center text-off-white relative group"
                style={{ color: "#f1f2f2" }}
              >
                {({ isActive }) => (
                  <motion.div
                    animate={isActive ? "active" : "visible"}
                    variants={navItemVariants}
                    className="flex items-center w-full h-[2rem] px-2 rounded-xl"
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm font-medium"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};

export default TalentSideBar;