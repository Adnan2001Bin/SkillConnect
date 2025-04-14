// src/pages/TalentManagement.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import Loader from "@/components/Loader/Loader";
import TalentCard from "@/components/Admin-View/TalentCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TalentManagement = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [editTalent, setEditTalent] = useState(null);
  const { user, isLoading: authLoading } = useAuthStore();

  // Fetch talents added by the admin
  useEffect(() => {
    const fetchTalents = async () => {
      if (!user || user.role !== "admin") return;
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/talents`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        setTalents(data.talents);
      } catch (err) {
        setError(err.message || "Failed to fetch talents");
        toast.error(err.message || "Failed to fetch talents", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTalents();
  }, [user]);

  // Toggle card expansion
  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
    if (editTalent && editTalent._id === id) setEditTalent(null);
  };

  // Handle talent deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/talents/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setTalents(talents.filter((talent) => talent._id !== id));
      setExpandedCard(null);
      toast.success("Talent deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || "Failed to delete talent", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Start editing a talent
  const handleEdit = (talent) => {
    setEditTalent({ ...talent });
    setExpandedCard(talent._id);
  };

  // Handle loading and error states
  if (authLoading || loading) {
    return <Loader text="Loading talents..." />;
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
          Talent Management
        </motion.h1>

        {talents.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-center text-sm sm:text-base lg:text-lg"
          >
            No talents added yet.
          </motion.p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {talents.map((talent) => (
              <TalentCard
                key={talent._id}
                talent={talent}
                expandedCard={expandedCard}
                toggleCard={toggleCard}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                editTalent={editTalent}
                setEditTalent={setEditTalent}
                setTalents={setTalents}
                setExpandedCard={setExpandedCard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentManagement;