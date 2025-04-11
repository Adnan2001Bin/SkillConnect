// src/components/Loader.jsx
import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png"; // Assuming you have a logo

const Loader = ({ text = "Loading..." }) => {
  // Animation variants for the dots
  const dotVariants = {
    animate: {
      y: [-10, 10, -10],
      opacity: [0.3, 1, 0.3],
      transition: {
        y: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
        opacity: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
      },
    },
  };

  // Animation for the logo
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Animation for the text
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          className="mb-6"
        >
          <img
            src={logo}
            alt="SkillConnect Logo"
            className="w-40 mx-auto opacity-90"
          />
        </motion.div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mb-4">
          <motion.div
            variants={dotVariants}
            animate="animate"
            className="w-3 h-3 bg-indigo-500 rounded-full"
          />
          <motion.div
            variants={dotVariants}
            animate="animate"
            className="w-3 h-3 bg-indigo-500 rounded-full"
            style={{ animationDelay: "0.2s" }}
          />
          <motion.div
            variants={dotVariants}
            animate="animate"
            className="w-3 h-3 bg-indigo-500 rounded-full"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          variants={textVariants}
          initial="initial"
          animate="animate"
          className="text-white text-lg font-medium"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;