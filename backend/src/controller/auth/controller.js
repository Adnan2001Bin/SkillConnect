import jwt from "jsonwebtoken";
import { User } from "../../models/auth/user.model.js";
import bcrypt from "bcryptjs";
import ms from "ms";
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
  