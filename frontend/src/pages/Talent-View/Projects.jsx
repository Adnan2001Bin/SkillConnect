import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Loader/Loader";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { technologies } from "@/config/technologies";

const TalentProjects = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectLink: "",
    images: [],
    technologies: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && user.projects) {
      setProjects(user.projects);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechnologyToggle = (techName) => {
    setFormData((prev) => {
      const updatedTechnologies = prev.technologies.includes(techName)
        ? prev.technologies.filter((tech) => tech !== techName)
        : [...prev.technologies, techName];
      return { ...prev, technologies: updatedTechnologies };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 images", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const newPreviews = [];
    const fileArray = files.map((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setImagePreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
      return file;
    });

    setFormData((prev) => ({ ...prev, images: fileArray }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("projectLink", formData.projectLink);
      formDataToSend.append("technologies", JSON.stringify(formData.technologies));
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/talent/projects`,
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setProjects((prev) => [...prev, data.project]);
      toast.success("Project added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to add project", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      projectLink: project.projectLink,
      images: [],
      technologies: project.technologies || [],
    });
    setImagePreviews(project.images || []);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("projectLink", formData.projectLink);
      formDataToSend.append("technologies", JSON.stringify(formData.technologies));
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/talent/projects/${editingProject._id}`,
        {
          method: "PUT",
          body: formDataToSend,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === editingProject._id ? data.project : proj
        )
      );
      toast.success("Project updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to update project", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/talent/projects/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
      toast.success("Project deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.message || "Failed to delete project", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      projectLink: "",
      images: [],
      technologies: [],
    });
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Filter technologies based on user's category
  const filteredTechnologies = user
    ? technologies.filter((tech) => tech.category === user.category)
    : [];

  if (authLoading) {
    return <Loader text="Loading projects..." />;
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
          <h1 className="text-2xl sm:text-3xl font-semibold text-dark-gray" style={{ color: "#333" }}>
            Your Projects
          </h1>
          {!isAdding && !editingProject && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors duration-200 text-sm sm:text-base"
              style={{ backgroundColor: "#4da59b" }}
            >
              <FaPlus /> Add Project
            </button>
          )}
        </div>

        {(isAdding || editingProject) && (
          <form
            onSubmit={isAdding ? handleAddProject : handleUpdateProject}
            className="space-y-6 mb-8 p-6 bg-off-white rounded-lg"
            style={{ backgroundColor: "#f1f2f2" }}
          >
            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Project Title
              </label>
              <input
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray focus:outline-none focus:ring-2 focus:ring-teal text-sm sm:text-base"
                placeholder="Project Title"
                style={{ borderColor: "#98c2bd", color: "#333" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Description
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray focus:outline-none focus:ring-2 focus:ring-teal text-sm sm:text-base"
                placeholder="Describe your project..."
                rows="4"
                style={{ borderColor: "#98c2bd", color: "#333" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Technologies Used
              </label>
              <div
                className="max-h-40 overflow-y-auto border border-medium-teal rounded-lg p-4 bg-white"
                style={{ borderColor: "#98c2bd" }}
              >
                {filteredTechnologies.length > 0 ? (
                  filteredTechnologies.map((tech) => (
                    <div key={tech.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`tech-${tech.id}`}
                        value={tech.name}
                        checked={formData.technologies.includes(tech.name)}
                        onChange={() => handleTechnologyToggle(tech.name)}
                        className="mr-2 h-4 w-4 text-teal focus:ring-teal border-medium-teal rounded"
                        style={{ accentColor: "#4da59b", borderColor: "#98c2bd" }}
                      />
                      <label
                        htmlFor={`tech-${tech.id}`}
                        className="text-sm text-dark-gray"
                        style={{ color: "#333" }}
                      >
                        {tech.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No technologies available for your category.
                  </p>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Select the technologies used in your project.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Project Link (Optional)
              </label>
              <input
                name="projectLink"
                type="url"
                value={formData.projectLink}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-medium-teal rounded-lg bg-white text-dark-gray focus:outline-none focus:ring-2 focus:ring-teal text-sm sm:text-base"
                placeholder="https://project-link.com"
                style={{ borderColor: "#98c2bd", color: "#333" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal mb-1" style={{ color: "#4da59b" }}>
                Project Images (Up to 5)
              </label>
              <input
                type="file"
                name="images"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                ref={fileInputRef}
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-all duration-200 text-sm sm:text-base"
                style={{ backgroundColor: "#4da59b" }}
              >
                Upload Images
              </button>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-medium-teal"
                      style={{ borderColor: "#98c2bd" }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Accepted formats: JPG, PNG (max 5 images)
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-teal text-white rounded-lg hover:bg-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
                style={{ backgroundColor: "#4da59b" }}
              >
                {isLoading ? "Saving..." : isAdding ? "Add Project" : "Save Changes"}
                <FaSave />
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        )}

        {projects.length === 0 && !isAdding && !editingProject ? (
          <p className="text-gray-500 text-center text-sm sm:text-base">
            No projects added yet. Add a project to showcase your work!
          </p>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="p-6 bg-off-white rounded-lg shadow-sm"
                style={{ backgroundColor: "#f1f2f2" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-gray" style={{ color: "#333" }}>
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-2 text-teal hover:text-teal-dark transition-colors duration-200"
                      style={{ color: "#4da59b" }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-teal mb-2" style={{ color: "#4da59b" }}>
                      Technologies Used:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-teal text-white text-sm rounded-full"
                          style={{ backgroundColor: "#4da59b" }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.images && project.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {project.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${project.title} image ${index + 1}`}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-medium-teal"
                        style={{ borderColor: "#98c2bd" }}
                      />
                    ))}
                  </div>
                )}

                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal hover:underline text-sm sm:text-base"
                    style={{ color: "#4da59b" }}
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TalentProjects;