import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js";
import { User } from "../../models/auth/user.model.js";

export const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, category, services, portfolio, experience, education } = req.body;
  
      if (!name || !category || !services) {
        return res.status(400).json({
          success: false,
          message: "Name, category, and services are required",
        });
      }
  
      let profileImageUrl = null;
      if (req.file) {
        const stream = Readable.from(req.file.buffer);
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "skillconnect/talents",
              allowed_formats: ["jpg", "png", "jpeg"],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.pipe(uploadStream);
        });
        profileImageUrl = uploadResult.secure_url;
      }
  
      const updatedData = {
        name,
        category,
        services: services ? JSON.parse(services) : [],
        portfolio,
        experience: experience ? JSON.parse(experience) : [],
        education: education ? JSON.parse(education) : [],
      };
  
      if (profileImageUrl) {
        updatedData.profileImage = profileImageUrl;
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          category: updatedUser.category,
          services: updatedUser.services,
          portfolio: updatedUser.portfolio,
          experience: updatedUser.experience,
          education: updatedUser.education,
          profileImage: updatedUser.profileImage,
          projects: updatedUser.projects || [],
        },
      });
    } catch (error) {
      console.error("Error updating talent profile:", error);
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred while updating the profile",
      });
    }
};

export const addProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, projectLink, technologies } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "talent") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only talents can add projects",
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const stream = Readable.from(file.buffer);
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "skillconnect/projects",
              allowed_formats: ["jpg", "png", "jpeg"],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.pipe(uploadStream);
        });
        imageUrls.push(uploadResult.secure_url);
      }
    }

    const newProject = {
      title,
      description,
      images: imageUrls,
      projectLink: projectLink || "",
      technologies: technologies ? JSON.parse(technologies) : [],
    };

    user.projects.push(newProject);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Project added successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while adding the project",
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { title, description, projectLink, technologies } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== "talent") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only talents can update projects",
      });
    }

    const project = user.projects.id(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (projectLink !== undefined) project.projectLink = projectLink;
    if (technologies) project.technologies = JSON.parse(technologies);

    if (req.files && req.files.length > 0) {
      let imageUrls = [];
      for (const file of req.files) {
        const stream = Readable.from(file.buffer);
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "skillconnect/projects",
              allowed_formats: ["jpg", "png", "jpeg"],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.pipe(uploadStream);
        });
        imageUrls.push(uploadResult.secure_url);
      }
      project.images = imageUrls;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the project",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const user = await User.findById(userId);
    if (!user || user.role !== "talent") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only talents can delete projects",
      });
    }

    const project = user.projects.id(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    user.projects.pull(projectId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the project",
    });
  }
};