// src/pages/Admin-View/User/Management.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import Loader from "@/components/Loader/Loader";
import UserCard from "@/components/Admin-View/UserCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const { user, isLoading: authLoading } = useAuthStore();

  // Fetch users with role = "user"
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== "admin") return;
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/users`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        setUsers(data.users);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
        toast.error(err.message || "Failed to fetch users", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  // Toggle card expansion
  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/users/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setUsers(users.filter((user) => user._id !== id));
      setExpandedCard(null);
      toast.success("User deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || "Failed to delete user", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle loading and error states
  if (authLoading || loading) {
    return <Loader text="Loading users..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <p className="text-red-400 text-center text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 sm:mb-10 lg:mb-12 text-center"
        >
          User Management
        </motion.h1>

        {users.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-center text-sm sm:text-base lg:text-lg"
          >
            No users found.
          </motion.p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                expandedCard={expandedCard}
                toggleCard={toggleCard}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;