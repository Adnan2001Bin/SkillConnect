// src/components/Admin/AdminSideBar.jsx
import { motion } from "framer-motion";
import { FaHome, FaUsers, FaUserPlus, FaCog } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { NavLink } from "react-router";
import { sidebarVariants, navItemVariants } from "@/utils/Admin/animationVariants";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaUserPlus />, label: "Add Talent", path: "/admin/add-talent" },
    { icon: <FaUsers />, label: "Users", path: "/admin/user-management" },
    { icon: <MdManageAccounts />, label: "Talent-Management", path: "/admin/talent-management" },
    { icon: <FaCog />, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <>
      {/* Hamburger Button for Mobile */}
      <button
        className="fixed top-4 left-4 z-50 text-white md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 p-4 z-40 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-48 lg:w-64`}
      >
        <div className="mb-6 sm:mb-8">
          <img
            className="w-24 sm:w-32 lg:w-40 mx-auto"
            src={logo}
            alt="SkillConnect Logo"
          />
        </div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg text-gray-300 transition-colors duration-200 ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`
              }
              onClick={() => setIsOpen(false)} // Close sidebar on mobile click
            >
              {({ isActive }) => (
                <motion.div
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center gap-2 sm:gap-3 w-full"
                >
                  <span className="text-lg sm:text-xl">{item.icon}</span>
                  <span className="text-sm sm:text-base">{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default AdminSideBar;