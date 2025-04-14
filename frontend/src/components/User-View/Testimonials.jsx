// src/components/User-View/Testimonials.jsx
import React from "react";
import { motion } from "framer-motion";

// Mock data (replace with API fetch in production)
const testimonials = [
  {
    id: "1",
    quote: "SkillConnect helped me find the perfect developer for my project. Highly recommend!",
    name: "John Doe",
    role: "Startup Founder",
  },
  {
    id: "2",
    quote: "The designer I hired exceeded my expectations. Amazing platform!",
    name: "Jane Smith",
    role: "Marketing Manager",
  },
  {
    id: "3",
    quote: "I found a data scientist who transformed our analytics. Great experience!",
    name: "Mike Wilson",
    role: "Data Analyst",
  },
];

const Testimonials = () => {
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
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our Users Say
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <p className="text-gray-600 text-sm sm:text-base italic text-center mb-4">
                "{testimonial.quote}"
              </p>
              <div className="text-center">
                <p className="text-gray-900 font-medium">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;