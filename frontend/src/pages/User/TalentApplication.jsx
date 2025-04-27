import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { containerVariants, childVariants } from "@/utils/Auth/animationVariants";
import { categories, allServices } from "@/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TalentApplication = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    services: [],
    portfolio: "",
    profileImage: null,
    experience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
    education: [{ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" }],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "category") {
      setFormData((prev) => ({ ...prev, services: [] }));
    }
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
      formDataToSend.append("email", formData.email);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("services", JSON.stringify(formData.services));
      formDataToSend.append("portfolio", formData.portfolio);
      formDataToSend.append("experience", JSON.stringify(formData.experience));
      formDataToSend.append("education", JSON.stringify(formData.education));
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/apply-talent`,
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      toast.success("Application submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to submit application", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryFromPath = (path) => {
    const params = new URLSearchParams(path.split("?")[1]);
    return params.get("category");
  };

  const filteredServices = allServices.filter(
    (service) => getCategoryFromPath(service.path) === formData.category
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <motion.h1
          variants={childVariants}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center"
        >
          Apply as a Talent
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={childVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              placeholder="John Doe"
            />
          </motion.div>

          <motion.div variants={childVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              placeholder="you@example.com"
            />
          </motion.div>

          <motion.div variants={childVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm sm:text-base"
              >
                Upload Image
              </button>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden"
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
          </motion.div>

          <motion.div variants={childVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={getCategoryFromPath(cat.path)}>
                  {cat.title}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={childVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Services
            </label>
            <select
              multiple
              name="services"
              value={formData.services}
              onChange={handleServicesChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base max-h-40 overflow-y-auto"
              disabled={!formData.category}
            >
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <option key={service.id} value={service.title}>
                    {service.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Select a category first
                </option>
              )}
            </select>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple services
            </p>
          </motion.div>

          <motion.div variants={childVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio URL
            </label>
            <input
              name="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              placeholder="https://portfolio.example.com"
            />
          </motion.div>

          <motion.div variants={childVariants}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Experience
            </h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="space-y-4 mb-4 p-4 bg-gray-100 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleArrayChange(index, "company", "experience", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => handleArrayChange(index, "role", "experience", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleArrayChange(index, "startDate", "experience", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleArrayChange(index, "endDate", "experience", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => handleArrayChange(index, "description", "experience", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
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
              className="text-green-500 hover:text-green-600 text-sm sm:text-base"
            >
              + Add Experience
            </button>
          </motion.div>

          <motion.div variants={childVariants}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Education
            </h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="space-y-4 mb-4 p-4 bg-gray-100 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleArrayChange(index, "institution", "education", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange(index, "degree", "education", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleArrayChange(index, "fieldOfStudy", "education", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => handleArrayChange(index, "startDate", "education", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => handleArrayChange(index, "endDate", "education", e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base"
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
              className="text-green-500 hover:text-green-600 text-sm sm:text-base"
            >
              + Add Education
            </button>
          </motion.div>

          <motion.div variants={childVariants}>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default TalentApplication;