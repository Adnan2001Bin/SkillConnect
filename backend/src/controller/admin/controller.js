import { sendEmail, validateFields } from "../auth/controller.js";
import { Readable } from "stream";

export const addTalent = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can add talents",
      });
    }

    const { name, email, password, skills, portfolio, experience, education } =
      req.body;

    // Validate required fields
    validateFields(["name", "email", "password"], req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    let profileImageUrl = null;

    // Handle image upload to Cloudinary
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new talent
    const newTalent = new User({
      name,
      email,
      password: hashedPassword,
      role: "talent",
      skills: skills ? skills.split(",").map((skill) => skill.trim()) : [],
      portfolio,
      experience: experience ? JSON.parse(experience) : [],
      education: education ? JSON.parse(education) : [],
      profileImage: profileImageUrl,
      createdBy: req.user.id,
    });

    await newTalent.save();

    // Send welcome email to talent
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

    res.status(201).json({
      success: true,
      message: "Talent added successfully",
      talent: {
        id: newTalent._id,
        name: newTalent.name,
        email: newTalent.email,
        role: newTalent.role,
        profileImage: newTalent.profileImage,
      },
    });
  } catch (error) {
    console.error("Error adding talent:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while adding the talent",
    });
  }
};
