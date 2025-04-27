import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronDown, FaChevronUp, FaDownload, FaCheck, FaTimes } from "react-icons/fa";

const TalentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const { user, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || user.role !== "admin") return;
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/talent-applications`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        setApplications(data.applications);
      } catch (err) {
        setError(err.message || "Failed to fetch applications");
        toast.error(err.message || "Failed to fetch applications", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleApprove = async (application) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/talent-applications/${application._id}/approve`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setApplications(applications.filter((app) => app._id !== application._id));
      toast.success("Application approved and talent added!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || "Failed to approve application", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/talent-applications/${id}/reject`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setApplications(applications.filter((app) => app._id !== id));
      toast.success("Application rejected successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || "Failed to reject application", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const confirmReject = (id) => {
    toast(
      <div>
        <p className="text-sm sm:text-base">Are you sure you want to reject this application?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              handleReject(id);
              toast.dismiss();
            }}
            className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-2 sm:px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs sm:text-sm"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleDownloadImage = (url, name) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}-profile-image.jpg`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((err) => {
        toast.error("Failed to download image", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  if (authLoading || loading) {
    return <Loader text="Loading applications..." />;
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
          Talent Applications
        </motion.h1>

        {applications.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-center text-sm sm:text-base lg:text-lg"
          >
            No talent applications at the moment.
          </motion.p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {applications.map((application) => {
              const isExpanded = expandedCard === application._id;
              return (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full"
                >
                  <div
                    className="flex flex-col sm:flex-row items-center p-4 sm:p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                    onClick={() => toggleCard(application._id)}
                  >
                    <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={
                          application.profileImage ||
                          "https://via.placeholder.com/150?text=No+Image"
                        }
                        alt={`${application.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
                        {application.name}
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base">{application.email}</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        {application.category}
                      </p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                        {application.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="px-2 sm:px-3 py-1 bg-indigo-600 text-white text-xs sm:text-sm rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        {application.services.length > 3 && (
                          <span className="text-gray-400 text-xs sm:text-sm">
                            +{application.services.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      {isExpanded ? (
                        <FaChevronUp className="text-indigo-400 text-lg sm:text-xl" />
                      ) : (
                        <FaChevronDown className="text-indigo-400 text-lg sm:text-xl" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 sm:p-6 bg-gray-850 border-t border-gray-700"
                      >
                        <div className="text-gray-300 space-y-4 sm:space-y-6">
                          {application.profileImage && (
                            <p className="text-sm sm:text-base">
                              <span className="font-semibold text-white">Profile Image:</span>{" "}
                              <button
                                onClick={() =>
                                  handleDownloadImage(application.profileImage, application.name)
                                }
                                className="text-indigo-400 hover:underline flex items-center gap-1"
                              >
                                <FaDownload className="text-sm" /> Download Image
                              </button>
                            </p>
                          )}
                          {application.portfolio && (
                            <p className="text-sm sm:text-base">
                              <span className="font-semibold text-white">Portfolio:</span>{" "}
                              <a
                                href={application.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:underline"
                              >
                                {application.portfolio}
                              </a>
                            </p>
                          )}
                          {application.category && (
                            <p className="text-sm sm:text-base">
                              <span className="font-semibold text-white">Category:</span>{" "}
                              {application.category}
                            </p>
                          )}
                          {application.services && application.services.length > 0 && (
                            <div>
                              <p className="font-semibold text-white text-sm sm:text-base">
                                Services:
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {application.services.map((service, index) => (
                                  <span
                                    key={index}
                                    className="px-2 sm:px-3 py-1 bg-indigo-600 text-white text-xs sm:text-sm rounded-full"
                                  >
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {application.experience && application.experience.length > 0 && (
                            <div>
                              <p className="font-semibold text-white text-sm sm:text-base">
                                Experience:
                              </p>
                              <ul className="mt-2 space-y-4">
                                {application.experience.map((exp, index) => (
                                  <li key={index} className="p-3 sm:p-4 bg-gray-900 rounded-lg">
                                    <p className="text-white text-sm sm:text-base">
                                      {exp.role} at {exp.company}
                                    </p>
                                    <p className="text-gray-400 text-xs sm:text-sm">
                                      {new Date(exp.startDate).toLocaleDateString()} -{" "}
                                      {exp.endDate
                                        ? new Date(exp.endDate).toLocaleDateString()
                                        : "Present"}
                                    </p>
                                    <p className="text-gray-500 mt-1 text-xs sm:text-sm">
                                      {exp.description}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {application.education && application.education.length > 0 && (
                            <div>
                              <p className="font-semibold text-white text-sm sm:text-base">
                                Education:
                              </p>
                              <ul className="mt-2 space-y-4">
                                {application.education.map((edu, index) => (
                                  <li key={index} className="p-3 sm:p-4 bg-gray-900 rounded-lg">
                                    <p className="text-white text-sm sm:text-base">
                                      {edu.degree} in {edu.fieldOfStudy}
                                    </p>
                                    <p className="text-gray-400 text-xs sm:text-sm">
                                      {edu.institution}
                                    </p>
                                    <p className="text-gray-500 text-xs sm:text-sm">
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
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
                            <button
                              onClick={() => handleApprove(application)}
                              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                            >
                              <FaCheck className="mr-2" /> Approve
                            </button>
                            <button
                              onClick={() => confirmReject(application._id)}
                              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                            >
                              <FaTimes className="mr-2" /> Reject
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentApplications;