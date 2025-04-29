import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import Loader from "@/components/Loader/Loader";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    y: -10,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    borderColor: "#10B981",
    transition: { duration: 0.3 },
  },
};

const TalentList = () => {
  const [talents, setTalents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTalents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/public/talents`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch talents");
        }
        setTalents(data.talents);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalents();
  }, []);

  if (isLoading) {
    return <Loader text="Loading talents..." />;
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-10 sm:mb-14 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Our Talents
        </motion.h2>

        {error && (
          <div className="text-center text-red-500 mb-6">{error}</div>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {talents.length > 0 ? (
            talents.map((talent) => (
              <Link
                key={talent._id}
                to={`/talentlist/${talent._id}`}
                className="focus:outline-none"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 h-80 flex flex-col justify-between transition-all duration-300"
                >
                  {/* Profile Image and Name */}
                  <div className="flex flex-col items-center mb-4">
                    {talent.profileImage ? (
                      <img
                        src={talent.profileImage}
                        alt={`${talent.name}'s profile`}
                        className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-green-500"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center mb-3">
                        <span className="text-white text-xl font-semibold">
                          {talent.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 text-center truncate w-full">
                      {talent.name}
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                      {talent.category}
                    </p>
                  </div>

                  {/* Experience Snippet */}
                  <p className="text-gray-600 text-sm text-center flex-grow line-clamp-3">
                    {talent.experience.length > 0
                      ? talent.experience[0].description
                      : "No experience details available."}
                  </p>

                  {/* Services */}
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">
                      Services:
                    </span>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {talent.services.slice(0, 3).map((service, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {talent.services.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{talent.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No talents available at the moment.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TalentList;