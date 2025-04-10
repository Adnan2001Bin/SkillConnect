import jwt from "jsonwebtoken";
import { User } from "../../models/auth/user.model.js";
import bcrypt from "bcryptjs";
import ms from "ms";
import transporter from "../../config/nodemailer.js";



//Create JWT
const createToken = (user) => {
  const { _id, role, email, name } = user;

  return jwt.sign(
    { id: _id, role, email, name },
    process.env.JWT_TOKEN_SECRET || "default_secret",
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
  );
};

// Utility: Validate Request Body
const validateFields = (fields, body) => {
  const isValid = fields.every((field) => body[field]);
  if (!isValid) {
    throw new Error(`Missing required fields: ${fields.join(", ")}`);
  }
};

// Utility: Send Email
const sendEmail = async (options) => {
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