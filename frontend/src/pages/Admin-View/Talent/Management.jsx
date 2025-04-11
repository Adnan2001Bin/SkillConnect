// src/pages/Admin-View/Talent/Management.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader/Loader";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const TalentManagement = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const { user, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/talents`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        setTalents(data.talents);
      } catch (err) {
        setError(err.message || "Failed to fetch talents");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchTalents();
    }
  }, [user]);

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (authLoading || loading) {
    return <Loader text="Loading talents..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white mb-10 text-center"
        >
          Talent Management
        </motion.h1>

        {talents.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-center text-lg"
          >
            No talents added yet.
          </motion.p>
        ) : (
          <div className="space-y-8">
            {talents.map((talent) => (
              <motion.div
                key={talent._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="flex items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors duration-200"
                  onClick={() => toggleCard(talent._id)}
                >
                  {/* Larger Profile Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 mr-6">
                    <img
                      src={
                        talent.profileImage ||
                        "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt={`${talent.name}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white">
                      {talent.name}
                    </h2>
                    <p className="text-gray-300">{talent.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {talent.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {talent.skills.length > 3 && (
                        <span className="text-gray-400">
                          +{talent.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Icon */}
                  <div className="ml-4">
                    {expandedCard === talent._id ? (
                      <FaChevronUp className="text-indigo-400 text-xl" />
                    ) : (
                      <FaChevronDown className="text-indigo-400 text-xl" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedCard === talent._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-gray-850 border-t border-gray-700"
                    >
                      <div className="text-gray-300 space-y-6">
                        {/* Portfolio */}
                        {talent.portfolio && (
                          <p>
                            <span className="font-semibold text-white">
                              Portfolio:
                            </span>{" "}
                            <a
                              href={talent.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:underline"
                            >
                              {talent.portfolio}
                            </a>
                          </p>
                        )}

                        {/* Skills (Full List) */}
                        {talent.skills && talent.skills.length > 0 && (
                          <div>
                            <p className="font-semibold text-white">Skills:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {talent.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {talent.experience && talent.experience.length > 0 && (
                          <div>
                            <p className="font-semibold text-white">
                              Experience:
                            </p>
                            <ul className="mt-2 space-y-4">
                              {talent.experience.map((exp, index) => (
                                <li
                                  key={index}
                                  className="p-4 bg-gray-900 rounded-lg"
                                >
                                  <p className="text-white">
                                    {exp.role} at {exp.company}
                                  </p>
                                  <p className="text-gray-400">
                                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                                    {exp.endDate
                                      ? new Date(exp.endDate).toLocaleDateString()
                                      : "Present"}
                                  </p>
                                  <p className="text-gray-500 mt-1">
                                    {exp.description}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Education */}
                        {talent.education && talent.education.length > 0 && (
                          <div>
                            <p className="font-semibold text-white">
                              Education:
                            </p>
                            <ul className="mt-2 space-y-4">
                              {talent.education.map((edu, index) => (
                                <li
                                  key={index}
                                  className="p-4 bg-gray-900 rounded-lg"
                                >
                                  <p className="text-white">
                                    {edu.degree} in {edu.fieldOfStudy}
                                  </p>
                                  <p className="text-gray-400">{edu.institution}</p>
                                  <p className="text-gray-500">
                                    {new Date(edu.startDate).toLocaleDateString()} -{" "}
                                    {edu.endDate
                                      ? new Date(edu.endDate).toLocaleDateString()
                                      : "Present"}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentManagement;