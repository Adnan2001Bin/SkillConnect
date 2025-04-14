// src/components/User-View/CTASection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const CTASection = () => {
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#16A34A",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Bring Your Project to Life?
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Post your project today and connect with top talent.
        </motion.p>
        <Link to="/post-project">
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            className="px-6 sm:px-8 py-3 bg-green-500 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-green-600"
          >
            Post a Project
          </motion.button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;