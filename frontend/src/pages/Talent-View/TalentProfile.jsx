import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Loader/Loader";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const TalentProfile = () => {
  const { user, updateUser, isLoading: authLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    services: [],
    portfolio: "",
    profileImage: null,
    experience: [],
    education: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load user data into formData when the component mounts or user changes
  useEffect(() => {
    if (user && user.role === "talent") {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        category: user.category || "",
        services: user.services || [],
        portfolio: user.portfolio || "",
        profileImage: null,
        experience: user.experience || [],
        education: user.education || [],
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (e) => {
    const options = e.target.options;
    const selectedServices = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedServices.push(options[i].value);
      }
    }
    setFormData((prev) => ({ ...prev, services: selectedServices }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (index, field, type, e) => {
    const newArray = [...formData[type]];
    newArray[index][field] = e.target.value;
    setFormData((prev) => ({ ...prev, [type]: newArray }));
  };

  const addArrayItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        type === "experience"
          ? { company: "", role: "", startDate: "", endDate: "", description: "" }
          : { institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const removeArrayItem = (index, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("services", JSON.stringify(formData.services));
      formDataToSend.append("portfolio", formData.portfolio);
      formDataToSend.append("experience", JSON.stringify(formData.experience));
      formDataToSend.append("education", JSON.stringify(formData.education));
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/talent/profile`,
        {
          method: "PUT",
          body: formDataToSend,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      // Update the user in the auth store
      await updateUser(data.user);

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data to original user data if canceling edit
      setFormData({
        name: user.name || "",
        email: user.email || "",
        category: user.category || "",
        services: user.services || [],
        portfolio: user.portfolio || "",
        profileImage: null,
        experience: user.experience || [],
        education: user.education || [],
      });
      setImagePreview(user.profileImage || null);
    }
  };

  if (authLoading) {
    return <Loader text="Loading profile..." />;
  }

  if (!user || user.role !== "talent") {
    return (
      <div className="min-h-screen bg-light-teal flex items-center justify-center p-4" style={{ backgroundColor: "#c1d4d3" }}>
        <p className="text-red-500 text-center text-sm sm:text-base">
          Unauthorized: You must be a talent to view this page.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-light-teal p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#c1d4d3" }}
    >
      <div className="max-w-4xl mx-auto bg-very-light-teal rounded-xl shadow-md p-6 sm:p-8" style={{ backgroundColor: "#e8f0ef" }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-dark-gray">
            Your Profile
          </h1>
          <button
            onClick={handleEditToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 text-sm sm:text-base ${
              isEditing ? "bg-red-500 hover:bg-red-600" : "bg-teal hover:bg-teal-dark"
            }`}
            style={{
              backgroundColor: isEditing ? "#f87171" : "#4da59b",
            }}
          >
            {isEditing ? (
              <>
                <FaTimes /> Cancel
              </>
            ) : (
              <>
                <FaEdit /> Edit Profile
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-off-white text-dark-gray focus:outline-none focus:ring-2 focus:ring-teal text-sm sm:text-base"
                placeholder="John Doe"
                style={{ borderColor: "#98c2bd", backgroundColor: "#f1f2f2", color: "#333" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-sm sm:text-base"
                style={{ borderColor: "#98c2bd", backgroundColor: "#e5e7eb", color: "#a0a0a0" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Profile Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  name="profileImage"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-all duration-200 text-sm sm:text-base"
                  style={{ backgroundColor: "#4da59b" }}
                >
                  Upload Image
                </button>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-medium-teal"
                    style={{ borderColor: "#98c2bd" }}
                  >
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Accepted formats: JPG, PNG (max 5MB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Category
              </label>
              <input
                name="category"
                type="text"
                value={formData.category}
                disabled
                className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-sm sm:text-base"
                style={{ borderColor: "#98c2bd", backgroundColor: "#e5e7eb", color: "#a0a0a0" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Services
              </label>
              <select
                multiple
                name="services"
                value={formData.services}
                onChange={handleServicesChange}
                required
                className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-off-white text-dark-gray focus:outline-none focus:ring-2 focus:ring-teal text-sm sm:text-base max-h-40 overflow-y-auto"
                style={{ borderColor: "#98c2bd", backgroundColor: "#f1f2f2", color: "#333" }}
              >
                {formData.services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
                {/* Add more options if needed, or fetch dynamically */}
              </select>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple services
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Portfolio URL
              </label>
              <input
                name="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-off-white text-dark-gray focus:outline-none focus:ring-2 focus:ring-teal text-sm sm:text-base"
                placeholder="https://portfolio.example.com"
                style={{ borderColor: "#98c2bd", backgroundColor: "#f1f2f2", color: "#333" }}
              />
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-dark-gray mb-4" style={{ color: "#333" }}>
                Experience
              </h2>
              {formData.experience.map((exp, index) => (
                <div key={index} className="space-y-4 mb-4 p-4 bg-off-white rounded-lg" style={{ backgroundColor: "#f1f2f2" }}>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleArrayChange(index, "company", "experience", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      Role
                    </label>
                    <input
                      type="text"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => handleArrayChange(index, "role", "experience", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleArrayChange(index, "startDate", "experience", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleArrayChange(index, "endDate", "experience", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      Description
                    </label>
                    <textarea
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => handleArrayChange(index, "description", "experience", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "experience")}
                      className="text-red-500 hover:text-red-600 text-sm sm:text-base"
                    >
                      Remove Experience
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("experience")}
                className="text-teal hover:text-teal-dark text-sm sm:text-base"
                style={{ color: "#4da59b" }}
              >
                + Add Experience
              </button>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-dark-gray mb-4" style={{ color: "#333" }}>
                Education
              </h2>
              {formData.education.map((edu, index) => (
                <div key={index} className="space-y-4 mb-4 p-4 bg-off-white rounded-lg" style={{ backgroundColor: "#f1f2f2" }}>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      Institution
                    </label>
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleArrayChange(index, "institution", "education", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      Degree
                    </label>
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleArrayChange(index, "degree", "education", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      Field of Study
                    </label>
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleArrayChange(index, "fieldOfStudy", "education", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => handleArrayChange(index, "startDate", "education", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => handleArrayChange(index, "endDate", "education", e)}
                      className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray text-sm sm:text-base"
                      style={{ borderColor: "#98c2bd", color: "#333" }}
                    />
                  </div>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "education")}
                      className="text-red-500 hover:text-red-600 text-sm sm:text-base"
                    >
                      Remove Education
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("education")}
                className="text-teal hover:text-teal-dark text-sm sm:text-base"
                style={{ color: "#4da59b" }}
              >
                + Add Education
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-teal text-white rounded-lg hover:bg-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
              style={{ backgroundColor: "#4da59b" }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
              <FaSave />
            </button>
          </form>
        ) : (
          // View Mode
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-medium-teal" style={{ borderColor: "#98c2bd" }}>
                <img
                  src={
                    user.profileImage ||
                    "https://via.placeholder.com/150?text=No+Image"
                  }
                  alt={`${user.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-semibold text-dark-gray" style={{ color: "#333" }}>
                  {user.name}
                </h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  {user.email}
                </p>
                <p className="text-teal text-sm sm:text-base mt-1" style={{ color: "#4da59b" }}>
                  {user.category}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-dark-gray mb-2" style={{ color: "#333" }}>
                Services
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal text-white text-sm rounded-full"
                    style={{ backgroundColor: "#4da59b" }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {user.portfolio && (
              <div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2" style={{ color: "#333" }}>
                  Portfolio
                </h3>
                <a
                  href={user.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal hover:underline text-sm sm:text-base"
                  style={{ color: "#4da59b" }}
                >
                  {user.portfolio}
                </a>
              </div>
            )}

            {user.experience && user.experience.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2" style={{ color: "#333" }}>
                  Experience
                </h3>
                <div className="space-y-4">
                  {user.experience.map((exp, index) => (
                    <div key={index} className="p-4 bg-off-white rounded-lg" style={{ backgroundColor: "#f1f2f2" }}>
                      <p className="text-dark-gray text-sm sm:text-base" style={{ color: "#333" }}>
                        {exp.role} at {exp.company}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {new Date(exp.startDate).toLocaleDateString()} -{" "}
                        {exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString()
                          : "Present"}
                      </p>
                      <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user.education && user.education.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2" style={{ color: "#333" }}>
                  Education
                </h3>
                <div className="space-y-4">
                  {user.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-off-white rounded-lg" style={{ backgroundColor: "#f1f2f2" }}>
                      <p className="text-dark-gray text-sm sm:text-base" style={{ color: "#333" }}>
                        {edu.degree} in {edu.fieldOfStudy}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {edu.institution}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {new Date(edu.startDate).toLocaleDateString()} -{" "}
                        {edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString()
                          : "Present"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TalentProfile;