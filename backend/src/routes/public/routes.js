import express from "express";
import { User } from "../../models/auth/user.model.js";

const router = express.Router();

// Public route to fetch all talents
router.get("/talents", async (req, res) => {
  try {
    const talents = await User.find({ role: "talent" }).select("-password");
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
});

// Public route to fetch a single talent by ID
router.get("/talents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const talent = await User.findOne({ _id: id, role: "talent" }).select("-password");
    if (!talent) {
      return res.status(404).json({
        success: false,
        message: "Talent not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Talent retrieved successfully",
      talent,
    });
  } catch (error) {
    console.error("Error fetching talent:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching the talent",
    });
  }
});

export default router;