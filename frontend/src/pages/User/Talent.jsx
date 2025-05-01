import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router"; // Add useLocation
import Loader from "@/components/Loader/Loader";
import { categories, allServices } from "@/config";

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
  const [filteredTalents, setFilteredTalents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  // Get query parameters from URL
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const serviceParam = params.get("service");

    // Set initial filter states based on query parameters
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }
    if (serviceParam) {
      setSelectedServices([decodeURIComponent(serviceParam)]);
    }
  }, [location.search]);

  // Fetch talents on component mount
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
        setFilteredTalents(data.talents); // Initially, show all talents
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalents();
  }, []);

  // Filter talents whenever selectedCategory, selectedServices, or talents change
  useEffect(() => {
    let filtered = talents;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (talent) => talent.category === selectedCategory
      );
    }

    // Filter by services (talent must offer at least one of the selected services)
    if (selectedServices.length > 0) {
      filtered = filtered.filter((talent) =>
        selectedServices.some((service) => talent.services.includes(service))
      );
    }

    setFilteredTalents(filtered);
  }, [selectedCategory, selectedServices, talents]);

  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedServices([]); // Reset services when category changes
  };

  // Handle service selection
  const handleServiceToggle = (serviceTitle) => {
    setSelectedServices((prev) =>
      prev.includes(serviceTitle)
        ? prev.filter((service) => service !== serviceTitle)
        : [...prev, serviceTitle]
    );
  };

  // Get services for the selected category
  const filteredServices = allServices.filter(
    (service) => service.category === selectedCategory
  );

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedServices([]);
    setFilteredTalents(talents);
  };

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

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Services Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50">
                {selectedCategory ? (
                  filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <div key={service.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`service-filter-${service.id}`}
                          value={service.title}
                          checked={selectedServices.includes(service.title)}
                          onChange={() => handleServiceToggle(service.title)}
                          className="mr-2 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`service-filter-${service.id}`}
                          className="text-sm text-gray-900"
                        >
                          {service.title}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No services available for this category.
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    Select a category to view services.
                  </p>
                )}
              </div>
            </div>

            {/* Reset Filters Button */}
            <div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-6">{error}</div>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTalents.length > 0 ? (
            filteredTalents.map((talent) => (
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
              No talents match your filter criteria.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TalentList;