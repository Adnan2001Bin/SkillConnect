import express from "express";
import { applyTalent, isAuthenticated, loginUser, logoutUser, registerUser, resetPassword, sendResetOtp } from "../../controller/auth/controller.js";
import { User } from "../../models/auth/user.model.js";
import { restrictToAdmin, verifyToken } from "../../config/middleware.js";
import upload from "../../config/multer.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/is-auth", isAuthenticated);
router.post("/logout", logoutUser);
router.post("/apply-talent", upload.single("profileImage"), applyTalent);
// backend/routes/auth/auth.routes.js
router.get("/users", verifyToken, restrictToAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("name email password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/users/:id", verifyToken, restrictToAdmin, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: "user" });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

export default router;
