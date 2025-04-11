import jwt from "jsonwebtoken";
import { User } from "../models/auth/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET || "default_secret");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export const restrictToAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to admins only",
      });
    }
    next(); // Proceed if the user is an admin
  };