import express from "express";
import { updateProfile } from "../../controller/talent/controller.js";
import { verifyToken } from "../../config/middleware.js";
import upload from "../../config/multer.js";

const router = express.Router();

router.put("/profile", verifyToken, upload.single("profileImage"), updateProfile);

export default router;