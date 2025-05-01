import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/Loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const TalentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [talent, setTalent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTalent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/public/talents/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch talent details");
        }
        setTalent(data.talent);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalent();
  }, [id]);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to start a chat.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/auth/login");
      return;
    }

    if (user.role === "talent") {
      toast.error("Talents cannot start chats with other talents.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsStartingChat(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ talentId: talent._id }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      toast.success("Chat started successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(`/my-profile?chatId=${data.chatId}`); // Redirect to user profile with chatId
    } catch (error) {
      toast.error(error.message || "Failed to start chat", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsStartingChat(false);
    }
  };

  if (authLoading || isLoading) {
    return <Loader text="Loading talent details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/talentlist"
            className="text-green-500 hover:text-green-600 font-medium"
          >
            Back to Talent List
          </Link>
        </div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Talent not found.</p>
      </div>
    );
  }

  return (
    <motion.section
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <motion.div
            variants={childVariants}
            className="lg:col-span-4 bg-white rounded-xl shadow-lg p-6 mb-8 lg:mb-0"
          >
            <div className="flex flex-col items-center">
              {talent.profileImage ? (
                <img
                  src={talent.profileImage}
                  alt={`${talent.name}'s profile`}
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-500 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center mb-4">
                  <span className="text-white text-4xl font-semibold">
                    {talent.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                {talent.name}
              </h1>
              <p className="text-lg text-gray-600 text-center mt-1">
                {talent.category}
              </p>
              <div className="mt-4 flex flex-col items-center gap-3">
                {talent.portfolio && (
                  <a
                    href={talent.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-colors duration-200"
                  >
                    View Portfolio
                  </a>
                )}
                <button
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                  className="inline-block px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStartingChat ? "Starting Chat..." : "Start Chat"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={childVariants}
            className="lg:col-span-8 space-y-8"
          >
            {/* Services */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Services
              </h2>
              <div className="flex flex-wrap gap-3">
                {talent.services.length > 0 ? (
                  talent.services.map((service, index) => (
                    <span
                      key={index}
                      className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200"
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No services listed.</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Experience
              </h2>
              {talent.experience.length > 0 ? (
                talent.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exp.role} at {exp.company}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No experience details available.</p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Education
              </h2>
              {talent.education.length > 0 ? (
                talent.education.map((edu, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {edu.degree}, {edu.fieldOfStudy}
                    </h3>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No education details available.</p>
              )}
            </div>

            {/* Back Button */}
            <div className="text-center">
              <Link
                to="/talentlist"
                className="inline-block px-8 py-3 bg-green-500 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-green-600 transition-colors duration-200 shadow-md"
              >
                Back to Talent List
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default TalentDetails;