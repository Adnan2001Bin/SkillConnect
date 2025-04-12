// src/components/Admin/User/UserCard.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const UserCard = ({ user, expandedCard, toggleCard, handleDelete }) => {
  const isExpanded = expandedCard === user._id;

  // Custom toast confirmation for delete
  const confirmDelete = (id) => {
    toast(
      <div>
        <p className="text-sm sm:text-base">Are you sure you want to delete this user?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              handleDelete(id);
              toast.dismiss();
            }}
            className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-2 sm:px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs sm:text-sm"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full"
    >
      {/* Card Header */}
      <div
        className="flex flex-col sm:flex-row items-center p-4 sm:p-6 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => toggleCard(user._id)}
      >
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 bg-gray-700 flex items-center justify-center">
          <span className="text-white text-lg sm:text-xl">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "NA"}
          </span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">{user.name}</h2>
          <p className="text-gray-300 text-sm sm:text-base">{user.email}</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          {isExpanded ? (
            <FaChevronUp className="text-indigo-400 text-lg sm:text-xl" />
          ) : (
            <FaChevronDown className="text-indigo-400 text-lg sm:text-xl" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 bg-gray-850 border-t border-gray-700"
          >
            <div className="text-gray-300 space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-white">Name:</span> {user.name}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-white">Email:</span> {user.email}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-white">Password:</span>{" "}
                <span className="text-gray-500">••••••••</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={() => confirmDelete(user._id)}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserCard;