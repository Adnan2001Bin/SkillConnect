import { sendEmail, validateFields } from "../auth/controller.js";
import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js";
import { User } from "../../models/auth/user.model.js";
import bcrypt from "bcryptjs";
import { TalentApplication } from "../../models/auth/talentApplication.model.js";

export const addTalent = async (req) => {
  try {
    if (req.user.role !== "admin") {
      throw new Error("Only admins can add talents");
    }

    const { name, email, password, category, services, portfolio, experience, education, profileImageUrl } = req.body;

    // Validate required fields
    validateFields(["name", "email", "password", "category", "services"], req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    let finalProfileImageUrl = profileImageUrl || null; // Use the provided URL if available (from approveTalentApplication)
    if (req.file && !finalProfileImageUrl) { // Only upload if no URL is provided
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
      finalProfileImageUrl = uploadResult.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newTalent = new User({
      name,
      email,
      password: hashedPassword,
      role: "talent",
      category,
      services: services ? JSON.parse(services) : [],
      portfolio,
      experience: experience ? JSON.parse(experience) : [],
      education: education ? JSON.parse(education) : [],
      profileImage: finalProfileImageUrl,
      createdBy: req.user.id,
    });

    await newTalent.save();

    await sendEmail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to SkillConnect - Your Talent Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">Welcome to SkillConnect, ${name}!</h2>
          <p style="font-size: 16px; color: #34495e;">
            Your talent account has been created by an admin. You can now log in to explore opportunities and showcase your skills.
          </p>
          <p style="font-size: 16px; color: #34495e;">
            <strong>Email:</strong> ${email}<br />
            <strong>Password:</strong> ${password} (Please change this after logging in)
          </p>
          <p style="font-size: 16px; color: #34495e;">
            Log in here: <a href="${
              process.env.FRONTEND_URL || "http://localhost:5500"
            }/auth/login" style="color: #3498db;">SkillConnect Login</a>
          </p>
          <p style="font-size: 14px; color: #7f8c8d; margin-top: 20px;">
            Need help? Contact us at <a href="mailto:support@skillconnect.com" style="color: #3498db;">support@skillconnect.com</a>.
          </p>
          <p style="font-size: 14px; color: #7f8c8d;">
            Cheers,<br />
            The SkillConnect Team
          </p>
        </div>
      `,
    });

    return {
      success: true,
      message: "Talent added successfully",
      talent: {
        id: newTalent._id,
        name: newTalent.name,
        email: newTalent.email,
        role: newTalent.role,
        category: newTalent.category,
        services: newTalent.services,
      },
    };
  } catch (error) {
    console.error("Error adding talent:", error);
    throw error; // Throw the error to be caught by the calling function
  }
};

export const getTalents = async (req, res) => {
  try {
    // Fetch all talents, no restriction on createdBy
    const talents = await User.find({ role: "talent" }).select("-password"); // Exclude password

    res.status(200).json({
      success: true,
      message: "Talents retrieved successfully",
      talents,
    });
  } catch (error) {
    console.error("Error fetching talents:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching talents",
    });
  }
};

// Update Talent (Admin Only)
export const updateTalent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update talents",
      });
    }

    const { id } = req.params;
    const { name, email, password, category, services, portfolio, experience, education } =
      req.body;

    const talent = await User.findOne({
      _id: id,
      role: "talent",
      createdBy: req.user.id,
    });

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: "Talent not found or not authorized to update",
      });
    }

    // Update fields
    if (name) talent.name = name;
    if (email) talent.email = email;
    if (password) talent.password = await bcrypt.hash(password, 12);
    if (category) talent.category = category;
    if (services) talent.services = JSON.parse(services);
    if (portfolio) talent.portfolio = portfolio;
    if (experience) talent.experience = JSON.parse(experience);
    if (education) talent.education = JSON.parse(education);

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
      talent.profileImage = uploadResult.secure_url;
    }

    await talent.save();

    res.status(200).json({
      success: true,
      message: "Talent updated successfully",
      talent: talent.toObject({
        getters: true,
        versionKey: false,
        transform: (doc, ret) => {
          delete ret.password;
          return ret;
        },
      }),
    });
  } catch (error) {
    console.error("Error updating talent:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the talent",
    });
  }
};

// Delete Talent (Admin Only)
export const deleteTalent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete talents",
      });
    }

    const { id } = req.params;
    const talent = await User.findByIdAndDelete({
      _id: id,
      role: "talent",
      createdBy: req.user.id, // Ensure only talents created by this admin can be deleted
    });

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: "Talent not found or not authorized to delete",
      });
    }

    res.status(200).json({
      success: true,
      message: "Talent deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting talent:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the talent",
    });
  }
};


export const getTalentApplications = async (req, res) => {
  try {
    const applications = await TalentApplication.find({ status: "pending" });
    res.status(200).json({
      success: true,
      message: "Talent applications retrieved successfully",
      applications,
    });
  } catch (error) {
    console.error("Error fetching talent applications:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching applications",
    });
  }
};

export const approveTalentApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await TalentApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Prepare the data for addTalent
    const password = Math.random().toString(36).slice(-8); // Generate a random password
    req.body = {
      name: application.name,
      email: application.email,
      password,
      category: application.category,
      services: JSON.stringify(application.services),
      portfolio: application.portfolio,
      experience: JSON.stringify(application.experience),
      education: JSON.stringify(application.education),
      profileImageUrl: application.profileImage, // Pass the existing profile image URL
    };

    // Since we're passing the profileImageUrl, we don't need to upload a new file
    req.file = null; // Ensure no file upload is attempted

    // Call addTalent
    const result = await addTalent(req);

    // Delete the application after successful talent creation
    await TalentApplication.findByIdAndDelete(id);

    // Send the response
    res.status(201).json({
      success: true,
      message: "Application approved and talent added successfully",
      talent: result.talent,
    });
  } catch (error) {
    console.error("Error approving talent application:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while approving the application",
    });
  }
};

export const rejectTalentApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await TalentApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await sendEmail({
      from: process.env.SENDER_EMAIL,
      to: application.email,
      subject: "Update on Your SkillConnect Talent Application",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">Hello, ${application.name},</h2>
          <p style="font-size: 16px; color: #34495e;">
            Thank you for applying to become a talent on SkillConnect. After careful review, we regret to inform you that your application has not been approved at this time.
          </p>
          <p style="font-size: 16px; color: #34495e;">
            We appreciate your interest and encourage you to apply again in the future.
          </p>
          <p style="font-size: 14px; color: #7f8c8d; margin-top: 20px;">
            Need help? Contact us at <a href="mailto:support@skillconnect.com" style="color: #3498db;">support@skillconnect.com</a>.
          </p>
          <p style="font-size: 14px; color: #7f8c8d;">
            Best regards,<br />
            The SkillConnect Team
          </p>
        </div>
      `,
    });

    await TalentApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Application rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting talent application:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while rejecting the application",
    });
  }
};