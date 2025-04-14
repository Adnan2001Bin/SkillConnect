// src/pages/User/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import Categories from "@/components/User-View/Catagories";
import PopularServices from "@/components/User-View/PopularServices";
import CTASection from "@/components/User-View/CTASection";
import Testimonials from "@/components/User-View/Testimonials";

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <motion.section
        className="bg-green-50 py-12 sm:py-16 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <motion.h1
                variants={textVariants}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              >
                Discover Top Talent with SkillConnect
              </motion.h1>
              <motion.p
                variants={textVariants}
                className="mt-4 text-base sm:text-lg lg:text-xl text-gray-600"
              >
                Connect with skilled professionals to bring your projects to life.
                Find the perfect talent for your needs today.
              </motion.p>
              <motion.div variants={textVariants} className="mt-6 sm:mt-8">
                <Link to="/talentlist">
                  <motion.button
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                    className="px-6 sm:px-8 py-3 bg-green-500 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-green-600"
                  >
                    Explore Talent
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            {/* Image */}
            <motion.div
              variants={imageVariants}
              className="lg:w-1/2 mt-8 lg:mt-0"
            >
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Talent collaboration"
                className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <Categories />

      {/* Popular Services Section */}
      <PopularServices />

      <Testimonials />

      <CTASection />

    </div>
  );
};

export default Home;