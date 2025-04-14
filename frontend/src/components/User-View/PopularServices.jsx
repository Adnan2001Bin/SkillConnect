// src/components/User-View/PopularServices.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router"; // Ensured correct import
import { popularServices } from "@/config";

const PopularServices = () => {
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 20px rgba(34, 197, 94, 0.2)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Popular Services
        </motion.h2>
        <motion.div
          className="flex flex-row flex-wrap justify-center gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {popularServices.map((service) => (
            <Link
              key={service.id}
              to={service.path}
              className="focus:outline-none"
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="flex flex-col w-[140px] sm:w-[150px] lg:w-[188px] h-[210px] sm:h-[225px] lg:h-[240px] border border-gray-200 rounded-lg hover:border-green-500 transition-colors duration-300 overflow-hidden bg-[#1A3C34]"
              >
                {/* Header */}
                <div className="flex items-center justify-center h-[30%] text-white p-3">
                  <h3 className="text-sm sm:text-base lg:text-lg font-medium text-center line-clamp-2">
                    {service.title}
                  </h3>
                </div>
                {/* Body */}
                <div className="flex items-center justify-center rounded-lg h-[70%] ">
                  <img
                    src={service.icon}
                    alt={`${service.title} icon`}
                    className="w-[9rem] h-[6.9rem] sm:w-[10rem] sm:h-[7.2rem] lg:w-[11rem] lg:h-[10rem] object-contain rounded-lg"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularServices;