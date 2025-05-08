import jwt from "jsonwebtoken";
import { User } from "../../models/auth/user.model.js";
import bcrypt from "bcryptjs";
import ms from "ms";
import transporter from "../../config/nodemailer.js";
import { TalentApplication } from "../../models/auth/talentApplication.model.js";
import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js"
//Create JWT
export const createToken = (user) => {
  const { _id, role, email, name } = user;

  return jwt.sign(
    { id: _id, role, email, name },
    process.env.JWT_TOKEN_SECRET || "default_secret",
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
  );
};

// Utility: Validate Request Body
export const validateFields = (fields, body) => {
  const isValid = fields.every((field) => body[field]);
  if (!isValid) {
    throw new Error(`Missing required fields: ${fields.join(", ")}`);
  }
};

// Utility: Send Email
export const sendEmail = async (options) => {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    validateFields(["name", "email", "password"], req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email. Please log in.",
      });
    }

    // Hash password and create user
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    // Generate token
    const token = createToken(newUser);
    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY || "1h"),
    });
    // Send welcome email
    await sendEmail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to SkillConnect!",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Welcome to SkillConnect, ${name}!</h2>
        <p style="font-size: 16px; color: #34495e;">
          We're thrilled to have you on board! Your account has been successfully created with the email: <strong>${email}</strong>.
        </p>
        <p style="font-size: 16px; color: #34495e;">
          At SkillConnect, we’re committed to providing you with the best experience. We look forward to supporting you on your journey with us!
        </p>
        <p style="font-size: 14px; color: #7f8c8d; margin-top: 20px;">
          Need help? Feel free to reach out to us at <a href="mailto:support@skillconnect.com" style="color: #3498db;">support@skillconnect.com</a>.
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
      message: "Registration successful",
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while registering the user.",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    validateFields(["email", "password"], req.body);

    // Check if user exists in the User collection
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    // Generate token
    const token = createToken(user);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY || "1h"),
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role, // Include the role in the response
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while logging in.",
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET || "default_secret"
    );

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }

    // Fetch user details
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "User is authenticated.", user });
  } catch (error) {
    console.error("Error during authentication check:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred during authentication check.",
    });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred during logout.",
    });
  }
};


export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    validateFields(["email"], req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + ms("15m");
    await user.save();

    // Send Reset OTP Email
    await sendEmail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP within 15 minutes.`,
    });

    res.json({ success: true, message: "Reset OTP sent to your email." });
  } catch (error) {
    console.error("Error during reset OTP generation:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while sending reset OTP.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    validateFields(["email", "otp", "newPassword"], req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetOtp = null;
    user.resetOtpExpireAt = null;
    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while resetting the password.",
    });
  }
};

export const applyTalent = async (req, res) => {
  try {
    const {
      name,
      email,
      category,
      services,
      portfolio,
      experience,
      education,
    } = req.body;

    validateFields(["name", "email", "category", "services"], req.body);

    const existingApplication = await TalentApplication.findOne({ email });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "An application with this email already exists",
      });
    }

    let profileImageUrl = null;
    if (req.file) {
      const stream = Readable.from(req.file.buffer);
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "skillconnect/talent-applications",
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

    const newApplication = new TalentApplication({
      name,
      email,
      category,
      services: services ? JSON.parse(services) : [],
      portfolio,
      experience: experience ? JSON.parse(experience) : [],
      education: education ? JSON.parse(education) : [],
      profileImage: profileImageUrl,
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Talent application submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting talent application:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while submitting the application",
    });
  }
};
