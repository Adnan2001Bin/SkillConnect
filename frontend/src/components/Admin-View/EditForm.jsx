// src/components/Admin-View/EditForm.jsx
import React from "react";
import { toast } from "react-toastify";
import { categories, allServices } from "@/config";

const EditForm = ({ editTalent, setEditTalent, talent, setTalents, setExpandedCard }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTalent((prev) => ({ ...prev, [name]: value }));
    if (name === "category") {
      setEditTalent((prev) => ({ ...prev, services: [] }));
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
    setEditTalent((prev) => ({ ...prev, services: selectedServices }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditTalent((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleArrayChange = (index, field, type, e) => {
    const newArray = [...editTalent[type]];
    newArray[index][field] = e.target.value;
    setEditTalent((prev) => ({ ...prev, [type]: newArray }));
  };

  const addArrayItem = (type) => {
    setEditTalent((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        type === "experience"
          ? { company: "", role: "", startDate: "", endDate: "", description: "" }
          : {
              institution: "",
              degree: "",
              fieldOfStudy: "",
              startDate: "",
              endDate: "",
            },
      ],
    }));
  };

  const removeArrayItem = (index, type) => {
    setEditTalent((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editTalent.name);
      formData.append("email", editTalent.email);
      formData.append("category", editTalent.category);
      formData.append("services", JSON.stringify(editTalent.services));
      formData.append("portfolio", editTalent.portfolio || "");
      formData.append("experience", JSON.stringify(editTalent.experience));
      formData.append("education", JSON.stringify(editTalent.education));
      if (editTalent.profileImage instanceof File) {
        formData.append("profileImage", editTalent.profileImage);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/talents/${editTalent._id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setTalents((prev) =>
        prev.map((t) => (t._id === editTalent._id ? data.talent : t))
      );
      setEditTalent(null);
      setExpandedCard(null);
      toast.success("Talent updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || "Failed to update talent", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getCategoryFromPath = (path) => {
    const params = new URLSearchParams(path.split("?")[1]);
    return params.get("category");
  };

  const filteredServices = allServices.filter(
    (service) => getCategoryFromPath(service.path) === editTalent.category
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">Name</label>
        <input
          name="name"
          type="text"
          value={editTalent.name}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">Email</label>
        <input
          name="email"
          type="email"
          value={editTalent.email}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">Category</label>
        <select
          name="category"
          value={editTalent.category}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
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
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">
          Services
        </label>
        <select
          multiple
          name="services"
          value={editTalent.services}
          onChange={handleServicesChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base max-h-40 overflow-y-auto"
          disabled={!editTalent.category}
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
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">
          Portfolio URL
        </label>
        <input
          name="portfolio"
          type="url"
          value={editTalent.portfolio || ""}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300">
          Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 text-gray-300 text-sm sm:text-base"
        />
      </div>

      {/* Experience Section */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
          Experience
        </h2>
        {editTalent.experience.map((exp, index) => (
          <div
            key={index}
            className="space-y-4 mb-4 p-3 sm:p-4 bg-gray-800 rounded-lg"
          >
            <input
              type="text"
              placeholder="Company"
              value={exp.company || ""}
              onChange={(e) => handleArrayChange(index, "company", "experience", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <input
              type="text"
              placeholder="Role"
              value={exp.role || ""}
              onChange={(e) => handleArrayChange(index, "role", "experience", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <input
              type="date"
              value={exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : ""}
              onChange={(e) => handleArrayChange(index, "startDate", "experience", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <input
              type="date"
              value={exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : ""}
              onChange={(e) => handleArrayChange(index, "endDate", "experience", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <textarea
              placeholder="Description"
              value={exp.description || ""}
              onChange={(e) => handleArrayChange(index, "description", "experience", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => removeArrayItem(index, "experience")}
              className="text-red-400 hover:text-red-300 text-sm sm:text-base"
            >
              Remove Experience
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("experience")}
          className="text-indigo-400 hover:text-indigo-300 text-sm sm:text-base"
        >
          + Add Experience
        </button>
      </div>

      {/* Education Section */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
          Education
        </h2>
        {editTalent.education.map((edu, index) => (
          <div
            key={index}
            className="space-y-4 mb-4 p-3 sm:p-4 bg-gray-800 rounded-lg"
          >
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution || ""}
              onChange={(e) => handleArrayChange(index, "institution", "education", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) => handleArrayChange(index, "degree", "education", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.fieldOfStudy || ""}
              onChange={(e) => handleArrayChange(index, "fieldOfStudy", "education", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <input
              type="date"
              value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""}
              onChange={(e) => handleArrayChange(index, "startDate", "education", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <input
              type="date"
              value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""}
              onChange={(e) => handleArrayChange(index, "endDate", "education", e)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => removeArrayItem(index, "education")}
              className="text-red-400 hover:text-red-300 text-sm sm:text-base"
            >
              Remove Education
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("education")}
          className="text-indigo-400 hover:text-indigo-300 text-sm sm:text-base"
        >
          + Add Education
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <button
          type="submit"
          className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => setEditTalent(null)}
          className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditForm;